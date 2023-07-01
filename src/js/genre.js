const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;
import {
  getParam,
  loadHeaderFooter,
  renderListWithTemplate,
} from "./utils.mjs";

loadHeaderFooter();

function movieGenreTemplate(movie) {
  const item = `
    <div class="movie-container">
      <h1 id="title">${movie.original_title}</h1>
      <div id="overview">Movie Overview: ${movie.overview}</div>
      <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.backdrop_path}" alt="${movie.original_title} image">
      <div id="release-date">release date:${movie.release_date}</div>
      <div id="vote-average">vote average:${movie.vote_average}</div>
      <div id="vote-count">vote count:${movie.vote_count}</div>
    </div>
    `;
  return item;
}

//used to set titles
const genreId = getParam("id");
const genre = getParam("genre");
const genreTitle = genre.charAt(0).toUpperCase() + genre.slice(1);
let title = document.querySelectorAll(".movie-title");
title.forEach((e) => {
  e.innerHTML = genreTitle + " Movies";
});

const movieListContainer = document.querySelector(".movie-list-container");

grabMoviesByGenre(genreId).then((movies) => {
  console.log(movies.results);
  renderListWithTemplate(
    movieGenreTemplate,
    movieListContainer,
    movies.results
  );
});

async function grabMoviesByGenre(genreId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const res = await fetch(
    url +
      `discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
    options
  );
  const movies = await res.json();
  return movies;
}
