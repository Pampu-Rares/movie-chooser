import '../css/roomManager.css'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { socket } from "../services/socketLogic"  
import RoomUsers from '../components/RoomUsers.jsx'

function RoomManager() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const username = decodeURIComponent(searchParams.get('username'))

    const [roomCode, setRoomCode] = useState(() => {
        const sessionRoom = JSON.parse(sessionStorage.getItem('room'))
        return sessionRoom ? sessionRoom.code : null
    })
    const [users, setUsers] = useState([])

    const handleRoomDelete = () => {
        sessionStorage.removeItem('room')
        socket.emit('deleteRoom', roomCode, () => {
            socket.disconnect()
            navigate('/')
        })
    }

    const startGame = () => {
        socket.emit('startGame', roomCode)
        navigate('/findMovie?roomCode='+roomCode)
    }

    const handleKick = userId => {
        socket.emit('kickUser', userId, roomCode)
    }

    useEffect(() => {
        const handleConnection = () => {
            const sessionRoom = JSON.parse(sessionStorage.getItem('room'))
            
            if(sessionRoom) {
                // implement admin rejoin

                socket.emit('rejoinAdmin', sessionRoom.code, sessionRoom.id, () => {
                    sessionStorage.setItem('room', JSON.stringify({
                        ...sessionRoom,
                        id: socket.id
                    }))
                })
            } else {
                socket.emit('createRoom', username, (code) => {
                    setRoomCode(code)
                    sessionStorage.setItem('room', JSON.stringify({
                        code: code,
                        id: socket.id
                    }))
                    setUsers([{id: socket.id, name: username}])
                })
            }

        }

        const handleUsers = (userId, users) => {
            console.log(users)
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
            <p>Socket id: {socket.id/* ? socket.id : 'none'*/}</p> 
            <div id="room-code-container">
                <p>Room code:</p>
                <p id='room-code'>{roomCode}</p>
            </div>
            <RoomUsers users={users} handleKick={handleKick} isAdmin={true}/>
            <button id='play' onClick={startGame}>Start game</button>
        </div>
    )
}

export default RoomManager