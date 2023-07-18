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
  let messageText;
  const sessionId = sessionStorage.getItem("mf-session-id");
  const accountMoviesListElement = document.querySelector(
    ".movie-list-container"
  );
  // const mainElement = document.querySelector("main");

  if (sessionId) {
    const accountMovies = await getAccountMovies(sessionId, movieListType);

    if (accountMovies.length === 0) {
      messageText = `<p>No ${movieListType} movies.</p>`;
      accountMoviesListElement.insertAdjacentHTML("beforeend", messageText);
    } else {
      renderListWithTemplate(
        movieCardTemplate,
        accountMoviesListElement,
        accountMovies
      );
    }
  } else {
    messageText = `<p>Login to see your ${movieListType} movies.</p>`;
    accountMoviesListElement.insertAdjacentHTML("beforeend", messageText);
  }
}

renderAccountMoviesType();
