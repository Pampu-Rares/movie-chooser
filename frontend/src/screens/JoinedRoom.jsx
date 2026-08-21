import '../css/joinedRoom.css'
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { socket } from "../services/socketLogic"
import RoomUsers from '../components/RoomUsers.jsx'

function JoinedRoom() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const username = decodeURIComponent(searchParams.get('username')) // dont need username but i am too lazy to remove it
    const roomCode = searchParams.get('roomCode')

    const [users, setUsers] = useState([])
    const [socketId, setSocketId] = useState('')
    const [kickedOut, setKickedOut] = useState(false)

    const leaveRoom = () => {
        socket.emit('leaveRoom', roomCode, () => {
            navigate('/joinRoom')
        })
    }

    useEffect(() => {
        const handleConnection = () => {
            setSocketId(socket.id)
            const previouslyJoinedRoom = JSON.parse(sessionStorage.getItem('joinedRoom'))
            if(previouslyJoinedRoom && previouslyJoinedRoom.id !== socket.id) {
                socket.emit('rejoinRoom', previouslyJoinedRoom.code, previouslyJoinedRoom.id, () => {
                    sessionStorage.setItem('joinedRoom', JSON.stringify({
                        ...previouslyJoinedRoom,
                        id: socket.id
                    }))
                })
            }
        }
        if(!socket.connected) {
            socket.connect()
            socket.once('connect', handleConnection)
        } else handleConnection()
    }, [])

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
            sessionStorage.removeItem('joinedRoom')
            navigate('/joinRoom')
        }
        const handleKick = () => {
            sessionStorage.removeItem('joinedRoom')
            setKickedOut(true)
        }
        socket.on('deletedRoom', handleDeletedRoom)
        socket.on('kickedOut', handleKick)
        return () => {
            socket.off('deletedRoom', handleDeletedRoom)
            socket.off('kickedOut', handleKick)
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
        <>
            <div id='joined-room-container'>
                <button id='leave-room-btn' onClick={leaveRoom}>Leave</button>
                <h1>Joined Room</h1>
                <p>Socket id: {socketId ? socketId : 'none'}</p>
                <div id="room-code-container">
                    <p>Room code:</p>
                    <p id='room-code'>{roomCode}</p>
                </div>
                <RoomUsers users={users} isAdmin={false} />
            </div>
            <div id='kicked-out-dialog' className={!kickedOut ? 'hidden' : ''}>
                <h3>Kicked out</h3>
                <p id='kick-explanation'>The admin kicked you out of the room. Return to the join room menu?</p>
                <button id='return-from-kick' onClick={() => {navigate('/joinRoom')}}>Return</button>
            </div>
        </>
    )
}

export default JoinedRoom