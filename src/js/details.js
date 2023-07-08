import {
  getParam,
  loadHeaderFooter,
  getMovieApi,
  renderWithTemplate,
} from "./utils.mjs";

loadHeaderFooter();

const id = getParam("id");

const movieDetails = await getMovieApi(id, grabMovieDetails);
const movieVideos = await getMovieApi(id, grabMovieVideos);

console.log(movieVideos);

function grabMovieDetails(id) {
  return `movie/${id}?language=en-US`;
}

function grabMovieVideos(id) {
  return `movie/${id}/videos?language=en-US`;
}
const parentElement = document.querySelector(".movie-info-container");

const render = renderWithTemplate(
  movieInfoTemplate,
  parentElement,
  movieDetails
);

const renderVideo = renderWithTemplate(
  movieVideoTemplate,
  parentElement,
  movieVideos,
  slidesListener
);

function movieInfoTemplate(movie) {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w400";
  const {
    id: movieId,
    title,
    vote_average,
    poster_path,
    overview,
    genres,
    homepage,
  } = movie;

  const genresList = [];
  genres.forEach((element) => {
    genresList.push(element.name);
  });

  const movieTemplate = `
      <h1 class="movie-info__title">${title}</h1>
      <div class="image-container">
         <div class="image">
            <img class="image-container__img" src="${IMAGE_PATH}${poster_path}" alt="${title} movie" />
            <span class="image-container__rating">
            ${ Math.round(vote_average * 10) / 10}
            </span>
          </div>
      </div>
      <span class="movie-info__genres">
        ${genresList.join(" / ")}
      </span>
      <div class="extra-info"></div>
      <div class="reviews"></div>
      <div class="movie-info__overview">
      ${overview}
      <a id="homepage" href="${homepage}"> 
      homepage
      </a> 
      </div>
    `;

  return movieTemplate;
}

async function movieVideoTemplate(videos) {
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
    console.log("next");
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
