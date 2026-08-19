import '../css/roomUsersComponent.css'

function RoomUsers({users, handleKick}) {
    return (
        <div id='users-container'>
                {users.map((user, index) => (
                    <div className='user' key={user.id}>
                        <p className='username'>{user.name}</p>
                        {index != 0 && <p className='kick' onClick={() => {handleKick(user.id)}}>Kick?</p>}
                    </div>
                ))}
        </div>
    )
}

export default RoomUsers