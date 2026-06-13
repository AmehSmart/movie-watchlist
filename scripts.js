const API_KEY = "74528754";
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const movieList = document.getElementById("movie-list");

const moviesMap = {};

function getStars(rating) {
    const maxStars = 5;
    const stars = Math.round((rating / 10) * maxStars);

    return "⭐".repeat(stars) + "☆".repeat(maxStars - stars);
}



async function searchMovie(){

    const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchInput.value}`
    );

    const data = await res.json();

    movieList.innerHTML = "";

    if (!data.Search) {
        movieList.innerHTML = "<p>No movies found</p>";
        return;
    }

    data.Search.forEach(async (movie) => {

        const detailRes = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`
        );

        const detailData = await detailRes.json();

        const movieData = {
            imdbID: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster,
            rating: detailData.imdbRating,
            runtime: detailData.Runtime,
            genre: detailData.Genre,
            plot: detailData.Plot
        };

        moviesMap[movie.imdbID] = movieData;

        movieList.innerHTML += `
            <div class="movie-card">

                <img
                    class="movie-poster"
                    src="${movie.Poster}"
                    alt="${movie.Title}"
                />

                <div class="movie-info">

                    <div class="movie-title-row">
                        <h2>${movie.Title}</h2>

                        <span class="movie-rating">
                            ${getStars(Number(detailData.imdbRating))}
                            ${detailData.imdbRating}
                        </span>
                    </div>

                    <div class="movie-meta">
                        <span>${detailData.Runtime}</span>
                        <span>${detailData.Genre}</span>

                        <button
                            class="watchlist-btn"
                            data-imdbid="${movie.imdbID}"
                        >
                            ➕ Watchlist
                        </button>
                    </div>

                    <p>${detailData.Plot}</p>

                </div>

            </div>
        `;
    });

    searchInput.value = "";
}

searchBtn.addEventListener("click", searchMovie );
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && searchInput.value.trim()) {
        searchMovie();
    }
});

movieList.addEventListener("click", (e) => {

    if (e.target.classList.contains("watchlist-btn")) {

        const imdbID = e.target.dataset.imdbid;

        const movie = moviesMap[imdbID];

        addToWatchlist(movie);

       
    }
});

function addToWatchlist(movie) {

    const watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    const alreadyExists =
        watchlist.some(item => item.imdbID === movie.imdbID);

    if (!alreadyExists) {

        watchlist.push(movie);

        localStorage.setItem(
            "watchlist",
            JSON.stringify(watchlist)
        );
    }
}