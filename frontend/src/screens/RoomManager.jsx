import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { socket } from "../services/socketLogic"  

function RoomManager() {
    const [searchParams] = useSearchParams()

    const isAdmin = searchParams.get('isAdmin')
    const username = searchParams.get('username')
    const [socketId, setSocketId] = useState(null)
    const [roomCode, setRoomCode] = useState(null)

    useEffect(() => {
        const handleConnection = () => {
            setSocketId(socket.id)
            socket.emit('createRoom')
        }
        const handleRoomCode = (code) => {
            setRoomCode(code)
        }

        socket.on('connect', handleConnection)
        socket.on('roomCode', handleRoomCode)

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
            <p>Room code: {roomCode}</p>
            
        </>
    )
}

export default RoomManager