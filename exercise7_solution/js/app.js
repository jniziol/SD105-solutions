const api_key = "3905f9c4"
const formElement = document.querySelector('#search');
const inputElement = formElement.querySelector('input');
const moviesContainer = document.querySelector('.titles-wrapper');

formElement.onsubmit = e => {
  e.preventDefault();
  if (inputElement.value.length > 0) {
    fetch(`http://www.omdbapi.com/?apikey=${api_key}&s=${inputElement.value}`)
      .then(response => response.json())
      .then(json => {
        json.Search.forEach(movie => {
          moviesContainer.textContent = "";

          fetch(`http://www.omdbapi.com/?apikey=${api_key}&i=${movie.imdbID}`)
            .then(response => response.json())
            .then(movie => { 
              let poster = `<img src="${movie.Poster}"/>`;
              
              if (movie.Poster === "N/A") {
                poster = `<picture>
                  <source type="image/avif" srcset="images/placeholder-movieimage.avif">
                  <img src="images/placeholder-movieimage.png">
                </picture>`;
              }
               
              moviesContainer.insertAdjacentHTML('afterbegin', `<div class="movie">
                ${poster}
                <div class="overlay">
                  <div class="title">${movie.Title}</div>
                  <div class="rating">${movie.imdbRating}/10</div>
                  <div class="plot">
                    ${movie.Plot}
                  </div>
                </div>
              </div>`);
          });
        })
      });
  }
}