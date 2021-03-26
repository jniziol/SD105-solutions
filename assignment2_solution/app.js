const appId = 'dcff8d53b108a25a5db3cb9e8e6e6d8b';

navigator.geolocation.getCurrentPosition(function(position) {
  getForecast(position.coords.latitude, position.coords.longitude);
  currentConditions(position.coords.latitude, position.coords.longitude); 
}, function() {
  getForecast(0, 0);
  currentConditions(position.coords.latitude, position.coords.longitude);
});

async function getForecast(lat, lon) {
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`)
  const forecastData = await forecastResponse.json();
  const dates = [];
  
  forecastData.list.forEach(snapshot => {
    const existingDate = dates.find(date => {
      return date.dayOftheWeek === new Date(snapshot.dt_txt + ` GMT+0:00`).toLocaleString('en-US', {weekday: 'long'});
    });
 
    if (existingDate === undefined) {
      dates.push({
        dayOftheWeek: new Date(`${snapshot.dt_txt} GMT+0:00`).toLocaleString('en-US', {weekday: 'long'}),
        high: snapshot.main.temp_max,
        low: snapshot.main.temp_min,
        icon: snapshot.weather[0].icon,
        description: snapshot.weather[0].description,
      });
    } else {
      existingDate.high = Math.max(existingDate.high, snapshot.main.temp_max);
      existingDate.low = Math.min(existingDate.low, snapshot.main.temp_min);
    }
  });

  const forecastEle = document.querySelector('.forecast');
  const today = new Date().toLocaleString('en-US', {weekday: 'long'});

  for(const day of dates) {
    if (day.dayOftheWeek !== today) {
      forecastEle.insertAdjacentHTML('beforeend', `
        <div class="day">
          <h3>${day.dayOftheWeek}</h3>
          <img src='http://openweathermap.org/img/wn/${day.icon}@2x.png'>
          <div class="description">${day.description}</div>
          <div class="temp">
            <span class="high">${Math.round(day.high)}&#8451;</span>/<span class="low">${Math.round(day.low)}&#8451;</span>
          </div>
        </div>
      `);
    }
  }
}

async function currentConditions(lat, lon) { 
  const conditionsResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`);
  const conditionsData = await conditionsResponse.json();
  const todayEle = document.querySelector('.current-conditions');

  todayEle.insertAdjacentHTML('afterbegin', `
    <h2>Current Conditions</h2>
    <img src="http://openweathermap.org/img/wn/${conditionsData.weather[0].icon}@2x.png">
    <div class="current">
      <div class="temp">${Math.round(conditionsData.main.temp)}&#8451</div>
      <div class="condition">${conditionsData.weather[0].description}</div>
    </div>
  `);
}