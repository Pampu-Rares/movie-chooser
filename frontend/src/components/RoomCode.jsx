import '../css/roomCode.css'

function RoomCodeContainer({roomCode, password}) {
    return (
        <div id='code-and-password-container'>
            <div id="room-code-container">
                <p>Room code:</p>
                <p id='room-code'>{roomCode}</p>
            </div>
            {(password!="null" && password != null) && (
                <div id="room-password-container">
                    <p>Password:</p>
                    <p id='room-password'>{password}</p>
                </div>
            ) }
        </div>
        
    )
}

export default RoomCodeContainer