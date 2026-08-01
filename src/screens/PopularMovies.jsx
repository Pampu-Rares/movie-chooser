import '../css/popularMovies.css'
import MovieCard from "../components/MovieCard"
import { useState, useEffect} from 'react'
import { getPopularMovies } from '../apiCalls/tmdbApi'

function PopularMovies() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [movies, setMovies] = useState([])
    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                if(Array.isArray(popularMovies)) {
                    setMovies(popularMovies)
                    console.log(popularMovies[0])
                } else {
                    throw new Error('Invalid data')
                }
            } catch(err) {
                setError('Error: ' + err.message)
            } finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    return (
        <div id="popular-movies-page">
            <h1>Popular Movies</h1>
            <div id="popular-movies-container">
                {loading && <p id="loading-message">Loading...</p>}
                {error ? (
                    <p id="error-message">{error}</p>
                ) : (
                    movies.map(movie => <MovieCard movie={movie} key={movie.id} />)
                )}
            </div>
        </div>
    )
}

export default PopularMovies