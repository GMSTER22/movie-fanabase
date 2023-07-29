const apikey = import.meta.env.VITE_MOVIE_DB_API_KEY;

import {
  getParam,
  loadHeaderFooter,
  renderWithTemplate,
  getMovieApi,
  renderListWithTemplate,
  addFavoriteMovie,
  addMovieToWatchlist,
} from "./utils.mjs";

loadHeaderFooter();

const paramId = getParam("id");

async function renderDetailsPage() {
  const movieDetails = await getMovieApi(paramId, grabMovieDetails);
  const movieVideos = await getMovieApi(paramId, grabMovieVideos);
  const movieReviews = await getMovieApi(paramId, grabMovieReviews);
  const movieCredits = await getMovieApi(paramId, grabMovieCredits, apikey);

  function grabMovieDetails(id) {
    return `movie/${id}?language=en-US`;
  }

  function grabMovieVideos(id) {
    return `movie/${id}/videos?language=en-US`;
  }

  function grabMovieReviews(id) {
    return `movie/${id}/reviews?language=en-US&page=1`;
  }

  function grabMovieCredits(id, apiKey) {
    return `movie/${id}/credits?api_key=${apiKey}`;
  }

  const parentElement = document.querySelector(".movie-info-container");
  const reviewList = document.querySelector(".review-list");

  await renderWithTemplate(
    movieInfoTemplate,
    parentElement,
    movieDetails,
    false,
    "afterbegin",
    false
  );

  const overview = document.querySelector(".movie-info__overview");

  await renderWithTemplate(
    movieCreditsTemplate,
    overview,
    movieCredits,
    runButtonFunctions,
    "beforeend",
    false
  );

  await renderWithTemplate(
    movieVideoTemplate,
    parentElement,
    movieVideos,
    slidesListener,
    "afterbegin",
    false
  );

  renderListWithTemplate(
    movieReviewsTemplate,
    reviewList,
    movieReviews.results,
    "beforeend",
    false
  );

  if (!reviewList.innerHTML.trim() == "") {
    const title = "<h2>Reviews</h2>";
    reviewList.insertAdjacentHTML("afterbegin", title);
  }
}

renderDetailsPage();

// templates
function movieInfoTemplate(movie) {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w400";
  const { title, vote_average, poster_path, overview, genres, homepage } =
    movie;

  const genresList = [];
  genres.forEach((element) => {
    genresList.push(element.name);
  });

  const movieTemplate = `
      <span class="movie-info__genres">
        ${genresList.join(" / ")}
      </span>
      <div id="buttons">
        <button class="btn" id="favorites">Add to Favorites</button>
        <button class="btn" id="watchlist">Add to Watchlist</button>
      </div>
      <h1 class="movie-info__title">${title}</h1>
      <div class="image-container">
         <div class="image">
            <img class="image-container__img" src="${IMAGE_PATH}${poster_path}" alt="${title} movie" />
            <span class="image-container__rating">
            ${Math.round(vote_average * 10) / 10}
            </span>
          </div>
      </div>
      <div class="movie-info__overview">
        ${overview}
        <a id="homepage" href="${homepage}" target="_blank"> 
        Visit Homepage Here
        </a> 
      </div>
    `;

  return movieTemplate;
}

function movieCreditsTemplate(credits) {
  let director = "";
  let producers = [];
  credits.crew.forEach((crewMember) => {
    if (crewMember.job === "Director") {
      director = crewMember.name;
    }
    if (crewMember.job === "Producer") {
      producers.push(crewMember.name);
    }
  });

  let mainCast = [];
  let index = 0;
  credits.cast.forEach((castMember) => {
    if (index > 6) {
      return;
    }
    mainCast.push(castMember.name);
    index++;
  });

  const creditsContainer = `
    <div class="credits"> 
      <p><b>Director:</b> ${director} </p>
      <p><b>Producers:</b><br> ${producers.join("<br>")} </p>
      <p id="cast"><b>Main Cast:</b><br> ${mainCast.join(`<br>`)}</p>
    </div>
  `;
  return creditsContainer;
}

function movieReviewsTemplate(reviews) {
  const { author, content, created_at, author_details } = reviews;

  const reviewsContainer = `
    <div id="outer-div"> 
     <div class="review-container">
          <span class="avatar"></span>
          <h2 class="name">${author}</h3>
          <div class="rating">Rating: ${author_details.rating}</div>
          <div class="created">Review made on: ${created_at}</div>
          <div class="content">${content}</div>
     </div>
    </div>  
 `;

  return reviewsContainer;
}

function movieVideoTemplate(videos) {
  const { results } = videos;
  let slideContainer = "";

  for (let i = 1; i < results.length; i++) {
    slideContainer += `
    <div class="slide-container">
      <div class="slide">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${results[i].key}" title="YouTube video player"
          frameborder="0"
          allowfullscreen></iframe>
      </div>
    </div>`;
  }

  const movieTemplate = `
     <div class="container-carousel">
      <div class="slide-container active">
        <div class="slide">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${results[0].key}" title="YouTube video player"
            frameborder="0"
            allowfullscreen></iframe>
        </div>
      </div>
      ${slideContainer}

      <div id="next"><i class="fa-solid fa-chevron-right"></i> </div>
      <div id="prev"><i class="fa-solid fa-chevron-left"></i> </div>

    </div>
  `;
  return movieTemplate;
}

//slides
function slidesListener() {
  let slides = document.querySelectorAll(".slide-container");
  let index = 0;

  function next() {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }

  function prev() {
    slides[index].classList.remove("active");
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add("active");
  }

  document.getElementById("next").addEventListener("click", next);
  document.getElementById("prev").addEventListener("click", prev);
}

//callback function for movie info template
function runButtonFunctions() {
  addToFavorites();
  addToWatchList();
}

function addToFavorites() {
  document.querySelector("#favorites").addEventListener("click", (e) => {
    const sessionId = sessionStorage.getItem("mf-session-id");
    addFavoriteMovie(sessionId, paramId);
  });
}

function addToWatchList() {
  document.querySelector("#watchlist").addEventListener("click", (e) => {
    const sessionId = sessionStorage.getItem("mf-session-id");
    addMovieToWatchlist(sessionId, paramId);
  });
}
