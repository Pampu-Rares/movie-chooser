import { socket } from "../services/socketLogic.js"
import { useState, useEffect} from 'react'
import MovieCard from "../components/MovieCard.jsx"

function ChooseMovieGame() {
    const [isConnected, setConnected] = useState(false)
    const [socketId, setSocketId] = useState(null)
    const [movies, setMovies] = useState([])

    useEffect(() => {

        const handleConnection = () => {
            setConnected(true)
            setSocketId(socket.id)
        }
        const handleMovies = (movies) => {
            setMovies(movies)
        }


        socket.on('connect', handleConnection)
        socket.on('movies', handleMovies)

        socket.connect()
        
        return () => {
            socket.off('connect', handleConnection)
            socket.off('movies', handleMovies)
        }

    }, [])

    return (
        <>
            <p>Socket id: {socketId}</p>
            {movies.map(movie => <MovieCard movie={movie} key={movie.id} />)}
        </>
    )
}

export default ChooseMovieGame