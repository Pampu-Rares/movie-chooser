import '../css/roomManager.css'
import { useSearchParams } from "react-router-dom"
import { useState, useEffect, use } from "react"
import { socket } from "../services/socketLogic"  

function RoomManager() {
    const [searchParams] = useSearchParams()

    const isAdmin = searchParams.get('isAdmin')
    const username = searchParams.get('username')
    const [socketId, setSocketId] = useState(null)
    const [roomCode, setRoomCode] = useState(null)
    const [users, setUsers] = useState([])

    useEffect(() => {
        const handleConnection = () => {
            setSocketId(socket.id)
            socket.emit('createRoom')
        }
        const handleRoomCode = (code) => {
            setRoomCode(code)
            setUsers([{id: socketId, name: username}])
        }
        const handleUserJoin = user => {
            setUsers(oldUsers => [...oldUsers, {id: user.id, name: user.name}])
        }

        socket.on('connect', handleConnection)
        socket.on('roomCode', handleRoomCode)
        socket.on('userJoin', handleUserJoin)

        socket.connect()

        return () => {
            socket.off('connect', handleConnection)
            socket.off('roomCode', handleRoomCode)
            // dont forget to add them all
        }
    }, [])

    return (
        <>
            <p>Room manager {isAdmin && 'for Admin'}</p>
            <p>Socket id: {socketId ? socketId : 'none'}</p>
            <div id="room-code-container">
                <p>Room code:</p>
                <p id='room-code'>{roomCode}</p>
            </div>
            <div id='users-container'>
                {users.map(user => (
                    <div className='user' key={user.id}>
                        <p className='username'>{user.name}</p>
                    </div>
                ))}
            </div>
            
        </>
    )
}

export default RoomManager