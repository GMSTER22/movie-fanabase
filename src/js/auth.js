import { loadHeaderFooter } from "./utils.mjs";
const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;
  
loadHeaderFooter()

async function createRequestToken() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const res = await fetch(url + "authentication/token/new", options);
  const reqToken = await res.json();
  return reqToken;
}

async function askUserPermission() {
  const requestToken = await createRequestToken();
  location.assign(
    `https://www.themoviedb.org/authenticate/${requestToken.request_token}?redirect_to=https://${location.host}`
  );
}

setTimeout(() => {
  askUserPermission();
}, 5000);
