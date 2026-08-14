import '../css/joinRoom.css'
import { useState } from 'react'
import { socket } from '../services/socketLogic'

function JoinRoom() {
    const [roomCode, setRoomCode] = useState()
    const [username, setUsername] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!socket.connected) {
            socket.connect()
        } else {
            socket.emit('joinRoom', )
        }
    }
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