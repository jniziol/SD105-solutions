const question = document.querySelector('.question');
const answers = document.querySelector('.answers');
let correctAnswer;

fetch('https://opentdb.com/api.php?amount=1&type=multiple')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .then(data => insertQuestion(data.results))
  .catch(errorMessage => console.log(errorMessage));

function insertQuestion(questions) {
  const newQuestion = questions.pop();
  question.innerHTML = newQuestion.question;
  correctAnswer = newQuestion.correct_answer;
  const incorrectAnswers = newQuestion.incorrect_answers;
  answers.textContent = "";
  [correctAnswer, ...incorrectAnswers].forEach(function(answer) {
    answers.insertAdjacentHTML('afterbegin', `
      <li>
        ${answer}
      </li>
    `);
  });
}

answers.addEventListener('click', function(e){
  if (e.target.nodeName === "LI") {
    if (e.target.innerText === correctAnswer) {
      Swal.fire({
        title: 'Correct!',
        text: 'Wow, great job!',
        icon: 'success',
      });
    } else {
      Swal.fire({
        title: 'Incorrect!',
        text: 'Try Again',
        icon: 'error',
      });
    }
  }
});
