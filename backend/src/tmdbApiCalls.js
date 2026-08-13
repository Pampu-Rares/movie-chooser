const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = process.env.API_KEY

export async function getPopularMovies() {
    let popularMovies = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    popularMovies = await popularMovies.json()
    return popularMovies
}

export async function searchMovies(query) {
    let searchResult = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    searchResult = await searchResult.json()
    return searchResult
}

export async function getGameMovies(number, apiKey) {
    const page = Math.floor(Math.random() * 60) + 1
    let result = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}`)
    result = await result.json()
    return result.results.filter(movie => !movie.softcore && !movie.adult && movie.vote_count > 1500).slice(0, 10)
}