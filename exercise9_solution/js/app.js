const apiKey = "api_key=0b941991fb739be72fed42ae5e2a4891";
const baseURL = "https://api.themoviedb.org/3";
const rootElement = document.querySelector("#root");

async function getMovies() {
  const response = await fetch(`${baseURL}/trending/movie/week?${apiKey}`);
  const movies = await response.json();
  return movies.results;
}

async function getGenres() {
  const response = await fetch(`${baseURL}/genre/movie/list?${apiKey}`);
  const genres = await response.json();
  return genres.genres;
}

(async () => {
  const movies = await getMovies();
  const genres = await getGenres();

  for (const genre of genres) {
    rootElement.insertAdjacentHTML('beforeend', `
      <div class="titleList">
        <div class="title">
          <h1>${genre.name}</h1>
          <div class="titles-wrapper" data-genre-id="${genre.id}">
          </div>
        </div>
      </div>
    `);
  }

  for (const movie of movies) {
    for (const genreID of movie.genre_ids) {
      const titleElement = document.querySelector(`.titles-wrapper[data-genre-id="${genreID}"]`)
      titleElement.insertAdjacentHTML('afterbegin', `
        <div class="movie">
        <img
          src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}"
        />
        <div class="overlay">
          <div class="title">${movie.title}</div>
          <div class="rating">${movie.vote_average}/10</div>
          <div class="plot">
            ${movie.overview}
          </div>
          <div class="listToggle">
            <div>
              <i class="fa fa-fw fa-plus"></i>
              <i class="fa fa-fw fa-check"></i>
            </div>
          </div>
        </div>
      </div>
      `);
    }
  }

  const allTitles = document.querySelectorAll('.titles-wrapper');

  for (const title of allTitles) {
    if (title.innerText === "") {
      title.closest('.titleList').remove();
    }
  }

})()
