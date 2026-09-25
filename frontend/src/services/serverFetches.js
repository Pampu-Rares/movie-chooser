const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getPopularMovies() {
    let popularMovies = await fetch(SERVER_URL)
    popularMovies = await popularMovies.json()
    return popularMovies.results
}

export async function searchMovies(query) {
    let searchResult = await fetch(SERVER_URL + `/searchMovies/${encodeURIComponent(query)}`)
    searchResult = await searchResult.json()
    return searchResult.results
}