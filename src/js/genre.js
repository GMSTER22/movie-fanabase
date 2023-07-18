const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;
import {
  getParam,
  loadHeaderFooter,
  renderListWithTemplate,
  movieCardTemplate,
} from "./utils.mjs";

loadHeaderFooter();

// function movieGenreTemplate(movie) {
//   const item = `
//     <div class="movie-container">
//       <h1 id="title">${movie.original_title}</h1>
//       <div id="overview">Movie Overview: ${movie.overview}</div>
//       <img src="https://image.tmdb.org/t/p/w400/${movie.poster_path}" alt="${movie.original_title} image">
//       <div id="release-date">release date:${movie.release_date}</div>
//       <div id="vote-average">vote average:${movie.vote_average}</div>
//       <div id="vote-count">vote count:${movie.vote_count}</div>
//     </div>
//     `;
//   return item;
// }

//used to set titles
const genreId = getParam("id");
const genre = getParam("genre");
// const genreTitle = genre.charAt(0).toUpperCase() + genre.slice(1);
// let titleElements = document.querySelectorAll(".movie-title");
// title.forEach((e) => {
//   e.innerHTML = genreTitle + " Movies";
// });
// const genreTitleElement = document.querySelector(".movie-title");
let titleElements = document.querySelectorAll(".movie-title");
const title = `${genre.toLocaleLowerCase()} Movies`;
titleElements.forEach((titleElement) => {
  titleElement.textContent = title;
});

grabMoviesByGenre(genreId).then((movies) => {
  const movieListContainer = document.querySelector(".movie-list-container");
  // console.log(movies.results);

  renderListWithTemplate(
    // movieGenreTemplate,
    movieCardTemplate,
    movieListContainer,
    movies.results
  );
});

async function grabMoviesByGenre(id) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const res = await fetch(
    url +
      `discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`,
    options
  );
  const movies = await res.json();
  return movies;
}
