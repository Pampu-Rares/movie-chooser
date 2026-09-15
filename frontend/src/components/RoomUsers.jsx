import '../css/roomUsersComponent.css'

function RoomUsers({users, handleKick, isAdmin}) {
    return (
        <div id='users-container'>
                {users.map((user, index) => (
                    <div className={(!isAdmin || index == 0)? 'user no-kick' : 'user'} key={user.id}>
                        <p className='username'>{user.name}</p>
                        {(index != 0 && isAdmin) && <p className='kick' onClick={() => {handleKick(user.id)}}>Kick?</p>}
                    </div>
                ))}
        </div>
    )
}

export default RoomUsers