import {
   
    loadHeaderFooter,
  
  } from "./utils.mjs";
  
  // header and footer
  loadHeaderFooter();
  
  const API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;
  
  const BASE_URL = 'https://api.themoviedb.org/3';
  const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
  const IMG_URL = 'https://images.tmdb.org/t/p/w500';
   
  
  const container = document.getElementById('movie-list-container');
  
  getMovies(API_URL);
  
  function getMovies(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        showMovies(data.results);
      });
  }
  
  function showMovies(data) {
    container.innerHTML = '';
  
    data.forEach((movie) => {
      const { id: movieId, title, poster_path, vote_average, overview } = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie-card');
      movieEl.innerHTML = `
        <a class="movie-card-item" href="/movie-details/index.html?id=${movieId}" data-id="${movieId}">
          <img class="movie-card__img" src="${IMG_URL + poster_path}" alt="${title}">
          <div class="movie-card__info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
          </div>
          <div class="movie-card__overview">
            <h3>Overview</h3>
            <p>${overview}</p>
          </div>
        </a>
      `;
      container.appendChild(movieEl);
    });
  }
  
  function getColor(vote) {
    if (vote >= 8) {
      return 'green';
    } else if (vote >= 5) {
      return 'orange';
    } else {
      return 'red';
    }
  }
  