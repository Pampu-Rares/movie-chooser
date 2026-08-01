const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_API_KEY

export async function getPopularMovies() {
    let popularMovies = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    popularMovies = await popularMovies.json()
    return popularMovies.results
}