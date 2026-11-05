import '../css/components-css/movieVisualiser.css'
import {useState, useEffect} from 'react'

function MovieVisualiser({movie, handleClose}) {
    console.log(movie)
    const [movieDescription, setMovieDescription] = useState(null)
    const [movieTitle, setMovieTitle] = useState(null)
    const [ratingIcon, setRatingIcon] = useState(null) // for now

    useEffect(() => {
        if(movie) {
            if(Object.hasOwn(movie, 'overview'))
                setMovieDescription(movie.overview)
            else setMovieDescription('A description isn\'t available for this movie')
            if(Object.hasOwn(movie, 'title'))
                setMovieTitle(movie.title)
            else setMovieTitle('Movie')
        }
    }, [movie])

    // movie-image may be already taken as id for img
    // maybe an icon/svg would be better than img for votes and voter icons
    return (
        <>
        {movie && (
        <div id='movie-visualiser-container'>
            <h4>{movieTitle}</h4>
            <span id='movie-visualiser-release-date'>{movie.release_date}</span>
            <div id='movie-visualiser-image-container'>
                <img id='movie-image-visualiser' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
            </div>
            <p id='movie-visualiser-description'>{movieDescription}</p>
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
            <button id='close-movie-visualiser-btn' onClick={handleClose}>Close</button>
        </div>
        )}
        </>
    )
}

export default MovieVisualiser