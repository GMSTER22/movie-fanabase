const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;

export function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");

  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#footer");

  renderWithTemplate(headerTemplateFn, headerEl);
  renderWithTemplate(footerTemplateFn, footerEl);
}

// grabs file at location and converts it to text.
function loadTemplate(path) {
  return async function () {
    const response = await fetch(path);
    if (response.ok) {
      const html = await response.text();
      return html;
    }
  };
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const html = await templateFn(data);
  parentElement.insertAdjacentHTML(position, html);
  if (callback) {
    callback(data);
  }
}

export function getParam(param = "product") {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// Movie card template
export function movieCardTemplate(movie) {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w400";
  const { id: movieId, title, vote_average, backdrop_path, poster_path, overview } = movie;

  const movieTemplate = `
    <a class="movie-card" href="/movie-details/index.html?id=${movieId}" data-id="${movieId}">
      <img class="movie-card__img" src="${IMAGE_PATH}${poster_path}" alt="${title} movie" />
      <div class="movie-card__info">
        <h3>${title}</h3>
        <span>${vote_average}</span>
      </div>
      <div class="movie-card__overview">
        <h3>Overview</h3>
        <p>${overview}</p>
      </div>
    </a>
  `;

  return movieTemplate;
}

// Filter movies by vote average vote
export function filterMoviesByAverageVote(movieList, voteAverage) {
  return movieList.filter(movie => {
    if (movie.vote_average > voteAverage) return movie;
  })
} 

// load navigation
export function loadNavigation() {
  const navigationTemplateFn = loadTemplate("/partials/navigation.html");

  const navigationElement = document.querySelector("nav.navigation");

  renderWithTemplate(navigationTemplateFn, navigationElement);
  requestIdleCallback(renderMovieGenres, {timeout: 0})
  requestIdleCallback(navigationAnimation, {timeout: 0})
}

// render genre list
async function getMovieGenres() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const response = await fetch(`${url}genre/movie/list?language=en`, options);
    
    if (response.ok) {
      const data = await response.json();
      const genres = await data.genres;
      // console.log(genres);
      return genres;
    } else {
      throw new Error("Failed to fetch the list of movie genres");
    }
  } catch (error) {
    console.log(error);
  }  
}

function movieGenreTemplate(genre) {
  const { id: genreId, name: genreName } = genre;

  const genreTemplate = `
    <li class="navigation__item">
      <a class="navigation__link" href="/genre/index.html?genre=${genreName}&id=${genreId}">${genreName}</a>
    </li>
  `;

  return genreTemplate;
}

async function renderMovieGenres() {
  const genreListElement = document.querySelector("#genre");
  const genreList = await getMovieGenres();
  renderListWithTemplate(movieGenreTemplate, genreListElement, genreList);
}

// Menu button functionality
function navigationAnimation() {
  const menuButton = document.querySelector("#menu-button");

  menuButton.addEventListener("click", event => {

    const navigationElement = event.target.closest("nav.navigation");

    navigationElement.classList.toggle("active");

  });
}