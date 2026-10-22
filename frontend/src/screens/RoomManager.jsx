import '../css/roomManager.css'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { socket } from "../services/socketLogic"  
import RoomUsers from '../components/RoomUsers.jsx'
import RoomCodeContainer from '../components/RoomCode.jsx'
import Loading from '../components/Loading.jsx'

function RoomManager() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const username = decodeURIComponent(searchParams.get('username'))
    const password = decodeURIComponent(searchParams.get('password'))
    const msSource = searchParams.get('ms')
    const countryCode = searchParams.get('country_code')

    const [roomCode, setRoomCode] = useState(() => {
        const sessionRoom = JSON.parse(sessionStorage.getItem('room'))
        return sessionRoom ? sessionRoom.code : null
    })
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

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
            const accuratePassword = password === "null" ? null : password;
            
            if(sessionRoom) {
                // implement admin rejoin

                socket.emit('rejoinAdmin', sessionRoom.code, sessionRoom.id, () => {
                    sessionStorage.setItem('room', JSON.stringify({
                        ...sessionRoom,
                        id: socket.id
                    }))
                    setLoading(false)
                })
            } else {
                socket.emit('createRoom', username, accuratePassword, msSource, countryCode, (code) => {
                    setRoomCode(code)
                    sessionStorage.setItem('room', JSON.stringify({
                        code: code,
                        id: socket.id
                    }))
                    setUsers([{id: socket.id, name: username}])
                    setLoading(false)
                })
            }
        }

        const handleUsers = (userId, users) => {
            //console.log(users)
            setUsers(users)
        }

        socket.on('connect', handleConnection)
        socket.on('userJoin', handleUsers)
        socket.on('userLeft', handleUsers)

        if(!socket.connected) {
            socket.connect()
        } else handleConnection()
        sessionStorage.removeItem('votedMovies')

        return () => {
            socket.off('connect', handleConnection)
            socket.off('userJoin', handleUsers)
            socket.off('userLeft', handleUsers)
        }
    }, [])

    //connection expired edge case
    useEffect(() => {
        const handleExpiredConnection = () => {
            setLoading(false)
            sessionStorage.removeItem('room')
            socket.disconnect()
            //sessionStorage.removeItem('votedMovies')
            navigate('/createRoom')
        }

        socket.on('connection-expired', handleExpiredConnection)
        return () => {
            socket.off('connection-expired', handleExpiredConnection)
        }
    })

    return (
        <div id='room-manager-screen'>
            <div id='room-manager-container' className={loading ? 'blurred' : ''}>
                <button id='delete-room' onClick={handleRoomDelete}>Delete Room</button>
                <h1>Manage room</h1>
                <p>Socket id: {socket.id/* ? socket.id : 'none'*/}</p> 
                <RoomCodeContainer roomCode={roomCode} password={password} />
                <RoomUsers users={users} handleKick={handleKick} isAdmin={true}/>
                <button id='play' onClick={startGame}>Start game</button>
            </div>
            {loading && <Loading />}
        </div>
        
    )
}

export default RoomManager