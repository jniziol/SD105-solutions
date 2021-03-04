const question = document.querySelector('.question');
const answers = document.querySelector('.answers');
const submit = document.querySelector('button');
const answerLabels = document.getElementsByTagName('.answers li label');
const httpRequest = new XMLHttpRequest();
let correctAnswer;
let questions;

httpRequest.onreadystatechange = fillTrivia;
httpRequest.open('GET', 'https://opentdb.com/api.php?amount=1&type=multiple');
httpRequest.send();

function fillTrivia() {
  if (this.readyState === XMLHttpRequest.DONE) {
    if (this.status === 200) {
      questions = JSON.parse(this.responseText).results;
      insertQuestion();
    } else {
      alert('There was a problem with the request.');
    }
  }
}

function insertQuestion() {
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