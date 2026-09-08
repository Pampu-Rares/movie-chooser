import '../css/joinRoom.css'
import { useState } from 'react'
import { socket } from '../services/socketLogic'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinRoom() {
    const navigate = useNavigate()
    const [roomCode, setRoomCode] = useState('')
    const [username, setUsername] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!username.trim().length) {
            alert('Enter a valid username')
            return ;
        }

        const executeJoin = () => {
            socket.emit('joinRoom', roomCode, username, (isSuccess) => {
                if(isSuccess) {
                    sessionStorage.setItem('joinedRoom', JSON.stringify({
                        code: roomCode,
                        id: socket.id
                    }))
                    navigate('/joinedRoom?username=' + encodeURIComponent(username) + '&roomCode=' + roomCode)
                } else {
                    alert('The room code you entered is invalid')
                    socket.disconnect()
                }
            })
        }

        if(!socket.connected) {
            socket.connect()
            socket.once('connect', executeJoin)
        } else {
            executeJoin()
        }
    }

    useEffect(() => {
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
        sessionStorage.removeItem('votedMovies')
    }, [])

    return (
        <>
            <h1>Join Room</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="enter-code">Enter the room code:<input id='enter-code' type='text' maxLength={10} value={roomCode} onChange={e => {setRoomCode(e.target.value)}}/></label>
                <label htmlFor="enter-name">Enter an username:<input id='enter-name' type='text' maxLength={20} placeholder='e.g: Ben Dover' value={username} onChange={e => {setUsername(e.target.value)}}/></label>
                <button type='submit'>Enter</button>
            </form>
        </>
    )
}

export default JoinRoom