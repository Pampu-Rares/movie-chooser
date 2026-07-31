import '../css/LandingPage.css'

function LandingPage() {
    return (
        <div id="landing-page">
            <h1>Movie Chooser</h1>
            <p>The site which helps you decide on what to watch with your friends</p>
            <div id="photo-loader">
                <img src="https://m.media-amazon.com/images/M/MV5BODg5ZTNmMTUtYThlNy00NjljLWE0MGUtYmQ1NDg4NWU5MjQ1XkEyXkFqcGc@._V1_.jpg" width={300} height={400}/>
            </div>
            <button id="play">Play</button>
        </div>
    )
}

export default LandingPage