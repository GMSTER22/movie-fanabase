import {
  getParam,
  loadHeaderFooter,
  renderListWithTemplate,
  movieCardTemplate,
  getAccountMovies,
} from "./utils.mjs";

loadHeaderFooter();

const movieListType = getParam("type");

let titleElements = document.querySelectorAll(".movie-title");

const title = `${movieListType.toLocaleLowerCase()} Movies`;

titleElements.forEach((titleElement) => {
  titleElement.textContent = title;
});

async function renderAccountMoviesType() {
  const accountMoviesListElement = document.querySelector(
    ".movie-list-container"
  );

  const sessionId = sessionStorage.getItem("mf-session-id");

  if (sessionId) {
    const accountMovies = await getAccountMovies(sessionId, movieListType);

    renderListWithTemplate(
      movieCardTemplate,
      accountMoviesListElement,
      accountMovies
    );
  } else {
    const mainElement = document.querySelector("main");
    const messageText = `<p>Login to see your ${movieListType} movies.</p>`;
    mainElement.insertAdjacentHTML("beforeend", messageText);
  }
}

renderAccountMoviesType();
