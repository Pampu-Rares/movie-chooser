const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_API_KEY

export async function getPopularMovies() {
    let popularMovies = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    popularMovies = await popularMovies.json()
    return popularMovies.results
}

export async function searchMovies(query) {
    let searchResult = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    searchResult = await searchResult.json()
    return searchResult.results
}