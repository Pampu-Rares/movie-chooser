

export async function getMovies(number, apiKey) {
    const page = Math.floor(Math.random() * 60) + 1
    let result = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}`)
    result = await result.json()
    return result.results.filter(movie => !movie.softcore && !movie.adult && movie.vote_count > 1500).slice(0, 10)
}