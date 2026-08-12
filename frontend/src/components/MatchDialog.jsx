import '../css/matchDialog.css'

function MatchDialog({ match, skipMatch }) {
    return (
        <div id="match-dialog" className={match.isMatch ? 'visible' : 'hidden'}>
            <p>You found your movie!</p>
            <div id='poster-container'>
                {match.movie && <img src={match.movie.movie.posterHref} /> }
            </div>
            <button id='check-out-movie'>Check out movie!</button>
            <button id='skip' onClick={skipMatch}>Continue</button>
        </div>
    )
}

export default MatchDialog