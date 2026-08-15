import '../css/movieSelector.css'
import { useState } from 'react'

function MovieSelector({movie, handleDislike, handleLike, like, dislike}) {
    const [showDetails, setShowDetails] = useState(false)
    return (
        <div id='swiper-container' className={like || dislike ? 'stop-overflow' : ''}>
            <div id="movie-selector" className={like ? 'liked' : dislike ? 'disliked' : ''}>
                <div id='movie-poster-container'>
                    <img id='movie-poster' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                </div>
                <h3 id='movie-title'>{movie.title}</h3>
                <div id='controls'>
                    <button id="dislike-btn" onClick={handleDislike}>
                        <img src='/negative-vote.png' />
                    </button>
                    <button id='see-details' onClick={() => {setShowDetails(!showDetails)}}>Details<span id='dot-animation'>...</span></button>
                    <button id="like-btn" onClick={handleLike}>
                        <img src='/positive-vote.png' />
                    </button>
                </div>
                <p id='movie-description' style={{maxHeight: showDetails ? '600px' : '0', opacity: showDetails ? '1' : '0' }}>{movie.overview}</p>
            </div>
        </div>
    )
}

export default MovieSelector