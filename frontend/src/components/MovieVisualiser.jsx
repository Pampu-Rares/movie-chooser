import '../css/components-css/movieVisualizer.css'
import {useState, useEffect} from 'react'

function MovieVisualizer({movie, handleClose}) {
    console.log(movie)
    const [movieDescription, setMovieDescription] = useState(null)
    const [movieTitle, setMovieTitle] = useState(null)
    const [ratingIcon, setRatingIcon] = useState(null) // for now
    const [voteRating, setVoteRating] = useState(null)
    const [voteCount, setVoteCount] = useState(null)
    const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)

    useEffect(() => {
        if(movie) {
            if(Object.hasOwn(movie, 'overview'))
                setMovieDescription(movie.overview)
            else setMovieDescription('A description isn\'t available for this movie')
            if(Object.hasOwn(movie, 'title'))
                setMovieTitle(movie.title)
            else setMovieTitle('Movie')
            if(Object.hasOwn(movie, 'title')) {
                let initialRating = movie.vote_average
                initialRating = Math.round(initialRating*10)
                setVoteRating(initialRating)
                if(initialRating > 75) setRatingIcon('/voting-icons/vote-like.svg')
                else if(initialRating > 40) setRatingIcon('/voting-icons/vote-meh.svg')
                     else setRatingIcon('/voting-icons/vote-dislike.svg')
            }
            else setVoteRating(6.7)
            if(Object.hasOwn(movie, 'vote_count')) {
                let initialVoteCount = movie.vote_count
                if(initialVoteCount>=1000000)
                    initialVoteCount = String(Math.trunc(initialVoteCount/1000000)) + 'M'
                else if(initialVoteCount >= 1000)
                    initialVoteCount = String(Math.trunc(initialVoteCount/1000)) + 'k'
                setVoteCount(initialVoteCount)
            }
            else setVoteCount('0')
        }
    }, [movie])

    // movie-image may be already taken as id for img
    // maybe an icon/svg would be better than img for votes and voter icons
    return (
        <div id='movie-visualizer-options-container'>
            {movie && (
            <div id='movie-visualizer-container' className={isGoogleModalOpen ? 'hidden' : ''}>
                <h4>{movieTitle}</h4>
                <span id='movie-visualizer-release-date'>{movie.release_date}</span>
                <div id='movie-visualizer-image-container'>
                    <img id='movie-image-visualizer' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                </div>
                <p id='movie-visualizer-description'>{movieDescription}</p>
                <div id='rating-div'>
                    <div id='rating-score-container'>
                        <span id='rating-score-span'>{voteRating}%</span>
                        <div id='rating-icon-container'>
                            <img id='rating-icon' src={ratingIcon} />
                        </div>
                    </div>
                    <div id='vote-count-container'>
                        {'('}
                        <span id='vote-count'>{voteCount}</span>
                        <img id='vote-count-icon' src='/viewer-count-icon.svg' />
                        {')'}
                    </div>
                </div>
                <div id='movie-visualizer-action-btns'>
                    <button id='search-on-google'>Search</button>
                    <button id='watchlist'>Add to Watchlist</button>
                </div>
                <button id='close-movie-visualizer-btn' onClick={handleClose}>Close</button>
            </div>
            )}
            <div id='search-on-google-modal' className={!isGoogleModalOpen ? 'hidden' : ''}>
                <h5>Attention</h5>
                <p>This action will close the current room and send you to the Google page of the movie</p>
                <div id='google-search-modal-options'>
                    <button id='continue-with-google-search'>Continue</button>
                    <button id='close-google-modal' onClick={() => setIsGoogleModalOpen(false)}>Return</button>
                </div>
            </div>
        </div>
    )
}

export default MovieVisualizer