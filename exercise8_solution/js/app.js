let page = 1;
const API_KEY = "0b941991fb739be72fed42ae5e2a4891";
const moviesElement = document.querySelector('.titles-wrapper');
const paginationElement = document.querySelector('.pagination');

getMovies();

async function getMovies() {
  const searchOptions = new URLSearchParams({
    api_key: API_KEY,
    page: page,
  });

  moviesElement.textContent = "";
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?${searchOptions}`)
  const json = await response.json();
  const moviesHTML = json.results.reduce((acc, movie) => {
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
      <div class="movie">
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

  moviesElement.innerHTML = moviesHTML;
  updatePagination(json.total_results);
}

const updatePagination = totalResults => {
  paginationElement.innerHTML = "";

  if(page !== 1) {
    paginationElement.insertAdjacentHTML('beforeend', `
      <button id="prev"><i class="fa fa-chevron-left"></i>Previous Page</button>
    `);
    const prevElement = document.getElementById('prev');
    prevElement.addEventListener('click', (e) => {
      page--;
      getMovies()
    })
  }

  if((page * 20) + 20 < totalResults) {
    paginationElement.insertAdjacentHTML('beforeend', `
      <button id="next">Next Page<i class="fa fa-chevron-right"></i></button>
    `);

    const nextElement = document.getElementById('next');
    nextElement.addEventListener('click', (e) => {
      page++;
      getMovies();
    });
  }
}