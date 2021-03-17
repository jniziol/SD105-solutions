const API_KEY = "0b941991fb739be72fed42ae5e2a4891";
const baseURL = "https://api.themoviedb.org/3"
const moviesElement = document.querySelector('.titles-wrapper');
const popularMovies = document.querySelector('.popular');

getMovies();

async function getMovies() {
  moviesElement.textContent = "";
  const response = await fetch(`${baseURL}/trending/movie/week?api_key=${API_KEY}`)
  const json = await response.json();
  const html = moviesHTML(json.results);
  moviesElement.innerHTML = html;
}

popularMovies.onclick = e => {
  const movie = e.target.closest('.movie')

  if (movie !== null) {
    getMovieReviews(movie.dataset.movieId);
  }
}

async function getMovieReviews(movieID) {
  const response = await fetch(`${baseURL}/movie/${movieID}/credits?api_key=${API_KEY}`)
  const credits = await response.json();
  const top6cast = credits.cast.sort((actorA, actorB) => actorB.popularity - actorA.popularity).slice(0,6);

  const goodMovies = await Promise.all(top6cast.map(async actor => {
    const response = await fetch(`${baseURL}/person/${actor.id}/movie_credits?api_key=${API_KEY}`)
    const movies = await response.json();
    const topMovies = movies.cast.sort((movieA, movieB) => movieB.popularity - movieA.popularity)
    return topMovies.slice(0, 5);
  }));

  insertMoviesIntoDOM(top6cast, goodMovies);
}

function insertMoviesIntoDOM(actors, movies) {
  const actorMoviesElements = document.querySelectorAll('.actor');
  actorMoviesElements.forEach(ele => ele.remove());

  movieHTML = "";
  actors.forEach((actor, index) => {
    console.log(index, actor)
    movieHTML += `<div class="title actor">
      <h1>${actor.name}</h1>
      <div class="titles-wrapper">
        ${moviesHTML(movies[index])}
      </div>
    </div>`
  });

  popularMovies.insertAdjacentHTML('afterend', movieHTML);
}

function moviesHTML(movies) {
  return movies.reduce((acc, movie) => {
    let poster;

    if (movie.backdrop_path) {
      poster = `<img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}" />`;
    } else {
      poster = `<picture>
                  <source srcset="images/placeholder-movieimage.avif">
                  <img src="images/placeholder-movieimage.png">
                </picture>`;
    }

    return acc + `
      <div class="movie" data-movie-id="${movie.id}">
        ${poster}
        <div class="overlay">
          <div class="title">${movie.title}</div>
          <div class="rating">${movie.vote_average}/10</div>
          <div class="plot">
            ${movie.overview}
          </div>
        </div>
      </div>`
  }, "");
}