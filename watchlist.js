const watchlistContainer =
    document.getElementById("watchlist-container");

const watchlist =
    JSON.parse(localStorage.getItem("watchlist")) || [];

function getStars(rating) {
    const maxStars = 5;
    const stars = Math.round((rating / 10) * maxStars);

    return "⭐".repeat(stars) + "☆".repeat(maxStars - stars);
}

if (watchlist.length === 0) {

    watchlistContainer.innerHTML = `
        <h2>Your watchlist is empty</h2>
    `;

} else {

    watchlist.forEach(movie => {

        watchlistContainer.innerHTML += `
            <div class="movie-card">

                <img
                    class="movie-poster"
                    src="${movie.poster}"
                    alt="${movie.title}"
                />

                <div class="movie-info">

                    <div class="movie-title-row">
                        <h2>${movie.title}</h2>

                        <span class="movie-rating">
                            ${getStars(Number(movie.rating))}
                            ${movie.rating}
                        </span>
                    </div>

                    <div class="movie-meta">
                        <span>${movie.runtime}</span>
                        <span>${movie.genre}</span>

                        <button
                            class="remove-btn"
                            data-imdbid="${movie.imdbID}"
                        >
                            ❌ Remove
                        </button>
                    </div>

                    <p>${movie.plot}</p>

                </div>

            </div>
        `;
    });
}

watchlistContainer.addEventListener("click", (e) => {

    if (e.target.classList.contains("remove-btn")) {

        const imdbID = e.target.dataset.imdbid;

        const updatedWatchlist = watchlist.filter(
            movie => movie.imdbID !== imdbID
        );

        localStorage.setItem(
            "watchlist",
            JSON.stringify(updatedWatchlist)
        );

        location.reload();
    }
});