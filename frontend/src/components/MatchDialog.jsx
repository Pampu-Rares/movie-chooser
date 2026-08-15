import '../css/matchDialog.css'

function MatchDialog({ match, skipMatch }) {
    console.log(match)
    return (
        <div id="match-dialog" className={match.isMatch ? 'visible' : 'hidden'}>
            <p>You found your movie!</p>
            <div id='poster-container'>
                {match.movie && <img src={`https://image.tmdb.org/t/p/w500/${match.movie.poster_path}`} /> }
            </div>
            <button id='check-out-movie'>Check out movie!</button>
            <button id='skip' onClick={skipMatch}>Continue</button>
        </div>
    )
}

export default MatchDialog