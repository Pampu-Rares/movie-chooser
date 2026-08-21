import '../css/popularMovies.css'
import MovieCard from "../components/MovieCard"
import { useState, useEffect} from 'react'
import { getPopularMovies, searchMovies } from '../services/serverFetches.js'

function PopularMovies() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [movies, setMovies] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    // need to add popularMovies to localSession so no multiple fetches happen

    const performSearch = async (e) => {
        e.preventDefault()
        if(!searchQuery.trim()) {
            alert('Enter a movie title')
        } else {
            setLoading(true)
            try {
                const searchedMovies = await searchMovies(searchQuery)
                if(Array.isArray(searchedMovies))
                    setMovies(searchedMovies)
                else throw new Error('Invalid data')
            } catch(err) {
                setError('Error:' + err.message)
            } finally {
                setLoading(false)
            }
        }
    }

    const cleanSearchQuery = async () => {
        try {
            setLoading(true)
            setSearchQuery('')
            const popularMovies = await getPopularMovies()
            if(Array.isArray(popularMovies))
                setMovies(popularMovies)
            else throw new Error('Invalid data')
        } catch(err) {
            setError('Error:' + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                if(Array.isArray(popularMovies)) {
                    setMovies(popularMovies)
                } else {
                    throw new Error('Invalid data')
                }
            } catch(err) {
                setError('Error: ' + err.message)
            } finally {
                setLoading(false)
            }
        }

        const oldRoom = JSON.parse(sessionStorage.getItem('room'))
        const oldJoinedRoom = JSON.parse(sessionStorage.getItem('joinedRoom'))
        if(oldRoom) {
                if(socket.connected) {
                    socket.emit('deleteRoom', oldRoom.code, () => {
                        socket.disconnect()
                        sessionStorage.removeItem('room')
                    })
                } else {
                    sessionStorage.removeItem('room')
                }
        }
        if(oldJoinedRoom) {
                if(socket.connected) {
                    socket.emit('leaveRoom', oldJoinedRoom.code, () => {
                        socket.disconnect()
                        sessionStorage.removeItem('joinedRoom')
                    })
                } else {
                    sessionStorage.removeItem('joinedRoom')
                }
        }

        loadPopularMovies()
    }, [])

    return (
        <div id="popular-movies-page">
            <h1>Popular Movies</h1>
            <form id="search-movie-form" onSubmit={performSearch}>
                <div id='search-bar-container'>
                    <input id="search-bar" type='text' maxLength={100} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <button id='delete-search' type='button' className={!searchQuery.length ? 'hidden' : ''} onClick={cleanSearchQuery}>X</button>
                </div>
                <button id="search-input-btn" type='submit'>⌕</button>
            </form>
            <div id="popular-movies-container">
                <p id="loading-message" className={!loading ? 'hidden' : ''}>Loading...</p>
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