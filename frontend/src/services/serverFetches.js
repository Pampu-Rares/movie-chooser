const PORT = import.meta.env.VITE_SERVER_PORT
const BASE_URL = `http://localhost:${PORT}/`

export async function getPopularMovies() {
    let popularMovies = await fetch(BASE_URL)
    popularMovies = await popularMovies.json()
    return popularMovies.results
}

export async function searchMovies(query) {
    let searchResult = await fetch(BASE_URL + `searchMovies/${encodeURIComponent(query)}`)
    searchResult = await searchResult.json()
    return searchResult.results
}