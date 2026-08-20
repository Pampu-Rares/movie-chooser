import '../css/createRoom.css'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'


function CreateRoom() {
    const navigate = useNavigate()
    const [selectedSource, setSelectedSource] = useState('ms-all')
    const [username, setUsername] = useState('')
    const [showDialog, setShowDialog] = useState(false)

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setShowDialog(true)
    }

    const handleNameEnter = () => {
        if(!username.trim().length) alert('Enter a valid username')
            else navigate('/manageRoom?username=' + encodeURIComponent(username))
    }

    return (
        <div id='create-room-container'>
            <h1>Create Room</h1>
            <form id='create-room-form' onSubmit={handleFormSubmit}>
                <div id='password-container'>
                    <label htmlFor='password'>Room password</label>
                    <input id='room-password' type='text' maxLength={20} placeholder='Optional'></input>
                </div>
                <p id='ms-label'>Movie Source</p>
                <div id='movie-source'>
                    <p id='ms-all' className='selected'>All</p>
                    <p id='ms-netflix'>Netflix</p>
                    <p id='ms-disney'>Disney +</p>
                    <p id='ms-hbo'>Hbo Max</p>
                </div>
                <div id='personal-options-section'>
                    <p>Add personal movie options?</p>
                    <div id='personal-options-checkbox' type='checkbox'>
                        <p>Yes</p>
                        <p className='selected'>No</p>
                    </div>
                </div>

                <button type='submit' id='create-room-btn'>Create</button>
            </form>
            <div id='set-name' className={showDialog ? 'visible' : 'hidden'}>
                <h3>Enter an username to use</h3>
                <input id='username-input' type='text' maxLength={16} value={username} onChange={(e) => setUsername(e.target.value)} />
                <button id='enter-username' onClick={handleNameEnter}>Enter</button>
            </div>
        </div>
    )
}

export default CreateRoom