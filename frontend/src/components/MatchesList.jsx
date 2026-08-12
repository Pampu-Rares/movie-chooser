import MovieCard from "./MovieCard"

function MatchesList({ matches }) {
    console.log(matches) // smth is broken here
    return (
        <div>
            <p id='end-message'>You went through all of the movies</p>
            {!matches.length ? (
                <div>
                    <p>It seems you haven't found a movie to watch yet. Play again?</p>
                    <button id='play-again-btn'>Play Again</button>
                </div>
            ) : (
                <div id='matches-list'>
                    {matches.map(movie => <MovieCard movie={movie} key={movie.id} />)}
                </div>
            )}
        </div>
    )
}

export default MatchesList