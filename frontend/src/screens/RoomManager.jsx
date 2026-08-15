import '../css/roomManager.css'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { socket } from "../services/socketLogic"  
import RoomUsers from '../components/RoomUsers.jsx'

function RoomManager() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isAdmin = searchParams.get('isAdmin')
    const username = decodeURIComponent(searchParams.get('username'))

    const [roomCode, setRoomCode] = useState(null)
    const [users, setUsers] = useState([])

    const handleRoomDelete = () => {
        socket.emit('deleteRoom', roomCode, () => {
            navigate('/')
        })
    }

    const startGame = () => {
        socket.emit('startGame', roomCode)
        navigate('/findMovie?roomCode='+roomCode)
    }

    useEffect(() => {
        const handleConnection = () => {
            socket.emit('createRoom', username, (code) => {
                setRoomCode(code)
                setUsers([{id: socket.id, name: username}])
            })
        }

        const handleUsers = (userId, users) => {
            setUsers(users)
        }

        socket.on('connect', handleConnection)
        socket.on('userJoin', handleUsers)
        socket.on('userLeft', handleUsers)

        if(!socket.connected) {
            socket.connect()
        } else handleConnection()

        return () => {
            socket.off('connect', handleConnection)
            socket.off('userJoin', handleUsers)
            socket.off('userLeft', handleUsers)
        }
    }, [])

    return (
        <div id='room-manager-container'>
            <button id='delete-room' onClick={handleRoomDelete}>Delete Room</button>
            <h1>Manage room</h1>
            <p>Socket id: {socket.id ? socket.id : 'none'}</p>
            <div id="room-code-container">
                <p>Room code:</p>
                <p id='room-code'>{roomCode}</p>
            </div>
            <RoomUsers users={users} />
            <button id='play' onClick={startGame}>Start game</button>
        </div>
    )
}

export default RoomManager