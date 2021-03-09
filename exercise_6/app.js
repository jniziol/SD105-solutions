const regions = ["4601", "4605", "4602", "4604", "4603"];
const today = new Date();
today.setDate(today.getDate() - 2);
const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
const tbodyElement = document.querySelector('.stats tbody');
const timeStamp = document.querySelector('.last-updated em');

const apiCalls = regions.map(region => 
  fetch(`https://api.opencovid.ca/summary?loc=${region}&after=${formattedDate}&ymd=true`)
    .then(response => response.json())
);

Promise.all(apiCalls).then(responses => {
  tbodyElementText = "";
  let todaysData;

  for (const response of responses) {
    todaysData = response.summary.pop();
    const yesterdaysData = response.summary.pop();
    const difference = todaysData.cases - yesterdaysData.cases;

    tbodyElementText += `
    <tr>
      <td>${todaysData.health_region}</td>
      <td>${todaysData.cases}</td>
      <td>${todaysData.deaths}</td>
      <td>${todaysData.cumulative_cases}</td>
      <td>${todaysData.cumulative_deaths}</td>
      <td>${difference > 0 ? `+${difference}` : difference}</td>
    </tr>`;
  }

  tbodyElement.innerHTML = tbodyElementText;
  console.log(todaysData);
  let today = new Date(todaysData.date);
  const userTimezoneOffset = today.getTimezoneOffset() * 60000;
  today = new Date(today.getTime() + userTimezoneOffset);
  timeStamp.textContent = today.toLocaleDateString('en-us', {weekday: "long", month: "long", day: "numeric", year: "numeric"});
});

