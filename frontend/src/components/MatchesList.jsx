import { useEffect, useState } from 'react'
import '../css/matchesList.css'
import MovieCard from "./MovieCard"
import { socket } from '../services/socketLogic'
import { useNavigate } from 'react-router-dom'

function MatchesList({ matches, roomCode}) {
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false)

    const handlePlayAgain = () => {
        const roomAdmin = sessionStorage.getItem('room')
        if(roomAdmin) {
            socket.emit('startGame', roomCode)
            navigate('/findMovie?roomCode=' + roomCode)
        }
    }

    useEffect(() => {
        const roomAdmin = sessionStorage.getItem('room')
        if(roomAdmin) setIsAdmin(true)
    }, [])

    useEffect(() => {
        const handleStartedGame = () => {
            navigate('/findMovie?roomCode='+roomCode)
        }

        socket.on('startGame', handleStartedGame)
        return () => {
            socket.off('startGame', handleStartedGame)
        }
    }, [])

    return (
        <div id='matches-container'>
            <p id='end-message'>You went through all of the movies</p>
            {!matches.length ? (
                <div>
                    <p>It seems you haven't found a movie to watch yet. {isAdmin ? 'Play again?' : ''}</p>
                    {isAdmin && <button id='play-again-btn' onClick={handlePlayAgain}>Play Again</button>}
                </div>
            ) : (
                <>
                    <div id='matches-list'>
                        {matches.map(movie => (movie && <MovieCard movie={movie} key={movie.id} />))}
                    </div>
                    {isAdmin && <button id='play-again-btn' onClick={handlePlayAgain}>Play Again</button> }
                </>
            )}
        </div>
    )
}

export default MatchesList