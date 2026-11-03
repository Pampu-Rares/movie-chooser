import {useState, useEffect} from 'react'

function MovieVisualiser({movie, handleClose}) {
    const [movieDescription, setMovieDescription] = useState(movie.overview) // not sure I need it
    const [ratingIcon, setRatingIcon] = useState(null) // for now

    // movie-image may be already taken as id for img
    // maybe an icon/svg would be better than img for votes and voter icons
    return (
        <>
        {movie && (
            <div id='movie-visualiser-container'>
            <h4>{movie.movieTitle}</h4>
            <div id='movie-image-container'>
                <img id='movie-image' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
            </div>
            <p id='movie-description'>{movieDescription}</p>
            <span id='release-date'>{movie.release_date}</span>
            <div id='rating-div'>
                <div id='rating-score-container'>
                    <span id='rating-score-span'>{movie.vote_average}</span>
                    <div id='rating-icon-container'>
                        <img id='rating-icon' src={ratingIcon} />
                    </div>
                </div>
                <div id='vote-count-container'>
                    {'('}
                    <span id='vote-count'>{movie.vote_count}</span>
                    <img id='vote-count-icon' src={null} />
                    {')'}
                </div>
            </div>

        </div>
        )}
        </>
    )
}

export default MovieVisualiser