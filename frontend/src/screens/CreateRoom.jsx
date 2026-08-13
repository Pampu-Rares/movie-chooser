import '../css/createRoom.css'
import {useState} from 'react'


function CreateRoom() {
    const [selectedSource, setSelectedSource] = useState('ms-all')

    const handleFormSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div id='create-room-container'>
            <h1>Create Room</h1>
            <form id='create-room-form' onSubmit={handleFormSubmit}>
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
                <div id='password-container'>
                    <label htmlFor='password'>Room password</label>
                    <input id='room-password' type='text' maxLength={20} placeholder='Optional'></input>
                </div>

                <button type='submit' id='create-room-btn'>Create</button>
            </form>
        </div>
    )
}

export default CreateRoom