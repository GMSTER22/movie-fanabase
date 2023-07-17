// Importing the API token and base URL as environment variables.
const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const api_key = import.meta.env.VITE_MOVIE_DB_API_KEY;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;

// Importing a set of helper functions from a utility module (utils.mjs)
import {
  getParam,
  loadHeaderFooter,
  renderListWithTemplate,
  movieCardTemplate,
} from "./utils.mjs";

// Calling the loadHeaderFooter function that may be used to dynamically add headers and footers to the webpage
loadHeaderFooter();

// Retrieves the category ID and name from the URL parameters.
const categoryId = getParam("id");
const category = getParam("category");
const top = "movie/top_rated";

let apiEndpoint;
switch (category) {
  case "popular":
    apiEndpoint = "movie/popular";
    break;
  case "top_rated":
    apiEndpoint = "movie/top_rated";
    break;
  case "upcoming":
    apiEndpoint = "movie/upcoming";
    break;
  default:
    console.log("Invalid category");
    break;
}

// Select all elements with the class "movie-title" and update their text content to be the category followed by "Movies"
let titleElements = document.querySelectorAll(".movie-title");

const categoryWithSpaces = category.replace(/_/g, " ");
const title =
  categoryWithSpaces.charAt(0).toUpperCase() + categoryWithSpaces.slice(1);
titleElements.forEach((titleElement) => {
  titleElement.textContent = title;
});

// Call the asynchronous function grabMoviesByCategory, passing the categoryId. When the promise resolves, it then updates the movie list on the page
grabMoviesByCategory(categoryId).then((movies) => {
  const movieListContainer = document.querySelector(".movie-list-container");

  renderListWithTemplate(
    movieCardTemplate, // Template function used to generate the HTML for each movie
    movieListContainer, // The container element where the movie list will be inserted
    movies.results // The array of movies that will be rendered
  );
});

// Asynchronous function that retrieves the list of movies for a given category ID
async function grabMoviesByCategory() {
  // Construct the URL to retrieve the list of movies for the given category ID
  const categoryUrl = `${url}${apiEndpoint}?api_key=${api_key}`;

  // Call the fetch function to retrieve the list of movies for the given category ID
  const response = await fetch(categoryUrl);
  // Convert the response into JSON format
  const movies = await response.json();
  // Return the list of movies
  console.log(movies);
  return movies;
}
