const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;

export function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");

  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#footer");

  const observer = new MutationObserver(onHeaderElementMutation);

  observer.observe(headerEl, { childList: true });

  renderWithTemplate(headerTemplateFn, headerEl);
  renderWithTemplate(footerTemplateFn, footerEl);
}

function onHeaderElementMutation(mutationList, observer) {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      const session_id = sessionStorage.getItem("mf-session-id");

      if (session_id) {

        updateAccountLink();

        observer.disconnect();
        
      }
    } 
  }
};

export function updateAccountLink() {
  const session_id = sessionStorage.getItem("mf-session-id");
  const accountLinkElement = document.querySelector("#account-link a");

  if (session_id) {

    accountLinkElement.innerHTML = "Logout";
    accountLinkElement.setAttribute("href", "/logout/index.html");

  } else {

    accountLinkElement.innerHTML = "Login";
    accountLinkElement.setAttribute("href", "/login/index.html");

  }

}

// grabs file at location and converts it to text.
function loadTemplate(path) {
  return async function () {
    const response = await fetch(path);
    if (response.ok) {
      const html = await response.text();
      return html;
    }
  };
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const html = await templateFn(data);
  parentElement.insertAdjacentHTML(position, html);
  if (callback) {
    callback(data);
  }
}

export function getParam(param = "product") {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// Movie card template
export function movieCardTemplate(movie) {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w400";
  const { id: movieId, title, vote_average, backdrop_path, poster_path, overview } = movie;

  const movieTemplate = `
    <a class="movie-card" href="/movie-details/index.html?id=${movieId}" data-id="${movieId}">
      <img class="movie-card__img" src="${IMAGE_PATH}${poster_path}" alt="${title} movie" />
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

  return movieTemplate;
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Filter movies by vote average vote
export function filterMoviesByAverageVote(movieList, voteAverage) {
  return movieList.filter(movie => {
    if (movie.vote_average > voteAverage) return movie;
  })
} 

// Get movie by category
export async function getMoviesByCategory(category, page = 1) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (!category) return;

  try {
    const response = await fetch(
      `${url}movie/${category}?language=en-US&page=${page}`,
      options
    );

    if (response.ok) {
      const movies = await response.json();
      return movies.results;
    } else {
      throw new Error(`Failed to fetch ${category} movies`);
    }
  } catch (error) {
    console.log(error);
  }
}

 
export async function getMovieApi(id, fetchFunction, apikey=null) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const res = await fetch(url + fetchFunction(id, apikey), options);
  const data = res.json();
  return data;
=======
// Add movie to watchlist
export async function addMovieToWatchlist(sessionId, movieId) {
  const options = {
    method: "POST",
    headers: { 
      accept: "application/json", 
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      media_type: "movie", 
      media_id: movieId, 
      watchlist: true
    })
  };

  try {
    const response = await fetch(
      `${url}account/null/watchlist?session_id=${ sessionId }`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.status_message, "Add movie to watchlist");
      return data;
    } else {
      throw new Error(`Failed to Add movie to your favorites`);
    }
  } catch (error) {
    console.log(error);
  }
}

// Add movie to favorite
export async function addFavoriteMovie(sessionId, movieId) {
  const options = {
    method: "POST",
    headers: { 
      accept: "application/json", 
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      media_type: "movie", 
      media_id: movieId, 
      favorite: true
    })
  };

  try {
    const response = await fetch(
      `${url}account/null/favorite?session_id=${ sessionId }`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.status_message, "Add movie to favorite");
      return data;
    } else {
      throw new Error(`Failed to Add movie to your favorites`);
    }
  } catch (error) {
    console.log(error);
  }
}

// Get a movie
export async function getAccountMovies(sessionId, movieListType) {

  const options = {
    method: "GET",
    headers: { 
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const response = await fetch(
      `${url}account/null/${ movieListType }/movies?language=en-US&page=1&session_id=${ sessionId }&sort_by=created_at.asc'`,
      options
    );

    if (response.ok) {
      const movies = await response.json();
      // console.log(movies.results, "Add movie to favorite");
      return movies.results;
    } else {
      throw new Error(`Failed to fetch user ${ movieListType } movies`);
    }
  } catch (error) {
    console.log(error);
  }

 
}
