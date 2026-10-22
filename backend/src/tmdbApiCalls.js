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

export async function getGameMovies(number, ms, countryCode, apiKey) {
    const msServices = {
        'ms-all': 'Any',
        'ms-netflix': 8,
        'ms-disney': 337,
        'ms-hbo': 1899
    }
    
    //console.log('Selected ms: ' + ms)
    const exploredPages = []
    let page = Math.floor(Math.random() * 60) + 1
    let result = []
    let dataFetch
    while(result.length < 10)
    {
        while(exploredPages.includes(page))
            page = Math.floor(Math.random() * 60) + 1
        exploredPages.push(page)
        if(ms == 'ms-all')
            dataFetch = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}`)
        else dataFetch = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}&with_watch_providers=${msServices[ms]}${countryCode ?'&watch_region=' + countryCode : ''}`)
        dataFetch = await dataFetch.json()
        result.push(...dataFetch.results.filter(movie => !movie.softcore && !movie.adult && movie.vote_count > 1500))
        result = result.slice(0, 10)
    }
    return result
}