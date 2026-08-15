import '../css/joinedRoom.css'
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { socket } from "../services/socketLogic"
import RoomUsers from '../components/RoomUsers.jsx'

function JoinedRoom() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const username = decodeURIComponent(searchParams.get('username'))
    const roomCode = searchParams.get('roomCode')

    const [users, setUsers] = useState([])
    const [socketId, setSocketId] = useState('')

    const leaveRoom = () => {
        socket.emit('leaveRoom', roomCode, () => {
            navigate('/joinRoom')
        })
    }

    useEffect(() => {
        const handleRoomUsers = (users) => {
            setUsers(users)
        }

        setSocketId(socket.id)
        socket.emit('getRoomUsers', roomCode, handleRoomUsers)
    }, [])

    useEffect(() => {
        const handleUpdatedUsersList = (socketId, users) => {
            setUsers(users)
        }

        socket.on('userLeft', handleUpdatedUsersList)
        socket.on('userJoin', handleUpdatedUsersList)

        return () => {
            socket.off('userLeft', handleUpdatedUsersList)
            socket.off('userJoin', handleUpdatedUsersList)
        }
    }, [])

    useEffect(() => {
        const handleDeletedRoom = () => {
            navigate('/joinRoom')
        }
        socket.on('deletedRoom', handleDeletedRoom)
        return () => {
            socket.off('deletedRoom', handleDeletedRoom)
        }
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
        <div id='joined-room-container'>
            <button id='leave-room-btn' onClick={leaveRoom}>Leave</button>
            <h1>Joined Room</h1>
            <p>Socket id: {socketId ? socketId : 'none'}</p>
            <div id="room-code-container">
                <p>Room code:</p>
                <p id='room-code'>{roomCode}</p>
            </div>
            <RoomUsers users={users} />
        </div>
    )
}

export default JoinedRoom