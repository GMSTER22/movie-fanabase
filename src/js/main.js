import {
  filterMoviesByAverageVote,
  loadHeaderFooter,
  movieCardTemplate,
  renderListWithTemplate,
  loadNavigation,
} from "./utils.mjs";

const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;

loadHeaderFooter();
loadNavigation();

const searchParamsString = window.location.search;
const urlSearchParams = new URLSearchParams(searchParamsString);

if (urlSearchParams.has("approved")) {
  const isApproved = urlSearchParams.get("approved");
  const requestToken = urlSearchParams.get("request_token");

  if (isApproved) {
    createSessionId(requestToken)
      .then((response) => {
        console.log(response, "checking");
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

// Render Upcoming movies

async function getUpcomingMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      `${url}movie/upcoming?language=en-US&page=1`,
      options
    );

    if (response.ok) {
      const movies = await response.json();
      return movies.results;
    } else {
      throw new Error("Failed to fetch upcoming movies");
    }
  } catch (error) {
    console.log(error);
  }
}

async function renderUpcomingMovies() {
  const upcomingMoviesElement = document.querySelector("#upcoming__movies");
  const upcomingMovies = await getUpcomingMovies();
  const movieList = filterMoviesByAverageVote(upcomingMovies, 7);

  renderListWithTemplate(
    movieCardTemplate,
    upcomingMoviesElement,
    movieList.splice(0, 6)
  );
}

renderUpcomingMovies();
