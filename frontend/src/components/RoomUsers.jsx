import '../css/roomUsersComponent.css'

function RoomUsers({users}) {
    return (
        <div id='users-container'>
                {users.map(user => (
                    <div className='user' key={user.id}>
                        <p className='username'>{user.name}</p>
                    </div>
                ))}
        </div>
    )
}

export default RoomUsers