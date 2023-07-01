import { loadHeaderFooter } from "./utils.mjs";

const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;
const searchParamsString = window.location.search;
const urlSearchParams = new URLSearchParams(searchParamsString);

loadHeaderFooter()

if (urlSearchParams.has("approved")) {
  const isApproved = urlSearchParams.get("approved");
  const requestToken = urlSearchParams.get("request_token");

  if (isApproved) {
    createSessionId(requestToken)
      .then((response) => console.log(response, "checking"))
      .catch((err) => console.error(err));
  }
}

console.log(grabMovies())

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

async function grabMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const res = await fetch(
    url +
      "discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    options
  );
  const movies = res.json();
  return movies;
}
