import {
  filterMoviesByAverageVote,
  getMoviesByCategory,
  loadHeaderFooter,
  movieCardTemplate,
  renderListWithTemplate,
  updateAccountLink,
  getMovieApi,
} from "./utils.mjs";

const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;

loadHeaderFooter();

const searchParamsString = window.location.search;
const urlSearchParams = new URLSearchParams(searchParamsString);

if (urlSearchParams.has("approved")) {
  const isApproved = urlSearchParams.get("approved");
  const requestToken = urlSearchParams.get("request_token");

  if (isApproved && !sessionStorage.getItem("mf-session-id")) {
    createSessionId(requestToken)
      .then((response) => {
        sessionStorage.setItem("mf-session-id", response.session_id);
        updateAccountLink();
      })
      .catch((err) => console.error(err));
  }
}

async function createSessionId(requestToken) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      request_token: requestToken,
    }),
  };

  const res = await fetch(url + "authentication/session/new", options);
  const sessionData = await res.json();
  return sessionData;
}

async function renderUpcomingMovies() {
  const upcomingMoviesElement = document.querySelector("#upcoming__movies");
  const upcomingMovies = await getMoviesByCategory("upcoming", 1);
  const movieList = filterMoviesByAverageVote(upcomingMovies, 7);

  renderListWithTemplate(
    movieCardTemplate,
    upcomingMoviesElement,
    movieList.splice(0, 6)
  );
}

renderUpcomingMovies();

// render genre list
async function getMovieGenres() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${url}genre/movie/list?language=en`, options);

    if (response.ok) {
      const data = await response.json();
      const genres = await data.genres;
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

renderMovieGenres();

// Menu button functionality

const menuButton = document.querySelector("#menu-button");

menuButton.addEventListener("click", (event) => {
  const navigationElement = event.target.closest("nav.navigation");

  navigationElement.classList.toggle("active");
});

document.querySelector(".hero__img").addEventListener("mouseover", (e) => {
  const heroContent = document.querySelector(".hero__content");
  const hero = heroContent.querySelector("h1");
  hero.style.cssText = "color: white; background-color: black; padding: 1rem; border-radius: 1rem ";
  
});

document.querySelector(".hero__img").addEventListener("mouseleave", (e) => {  
  const heroContent = document.querySelector(".hero__content");
  const hero = heroContent.querySelector("h1");
  hero.style.cssText = "color: white; background: none";
 })

