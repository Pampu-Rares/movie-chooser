import '../css/roomCode.css'

function RoomCodeContainer({roomCode}) {
    return (
        <div id="room-code-container">
            <p>Room code:</p>
            <p id='room-code'>{roomCode}</p>
        </div>
    )
}

export default RoomCodeContainer