import '../css/popularMovies.css'
import MovieCard from "../ components/MovieCard"

function PopularMovies() {
    const movies = [
        {
            url: 'https://cdng.europosters.eu/pod_public/1300/244029.jpg',
            title: "Terminator",
            release_date: "2026-01-21",
            key: 1
        },
        {
            url: 'https://m.media-amazon.com/images/M/MV5BODg5ZTNmMTUtYThlNy00NjljLWE0MGUtYmQ1NDg4NWU5MjQ1XkEyXkFqcGc@._V1_.jpg',
            title: "Star Wars",
            release_date: "2019-11-16",
            key: 2
        },
        {
            url: 'https://cdng.europosters.eu/pod_public/1300/244029.jpg',
            title: "Terminator",
            release_date: "2026-01-21",
            key: 3
        },
    ]
    return (
        <div id="popular-movies-page">
            <h1>Popular Movies</h1>
            <div id="popular-movies-container">
                {
                    movies.map(movie => <MovieCard movie={movie} key={movie.key}/>)
                }
            </div>
        </div>
    )
}

export default PopularMovies