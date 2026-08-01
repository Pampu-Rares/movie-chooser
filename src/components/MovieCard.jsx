import '../css/movieCard.css'

function MovieCard({movie}) {
    return (
            <div className="movie-card">
                <div className='movie-image-container'>
                    <img className="movie-image" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}/>
                </div>
                <p className="title">{movie.title}</p>
                <p className="release-date">{movie.release_date}</p>
            </div>
    )
}

export default MovieCard