import '../css/createRoom.css'
import {useState} from 'react'


function CreateRoom() {

    const handleFormSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div id='create-room-container'>
            <h1>Create Room</h1>
            <form id='create-room-form'>
                <label>Movie Source</label>
                <label>Add personal options?</label>
                <input type='checkbox'></input>

                <button type='submit' id='create-room-btn'>Create</button>
            </form>
        </div>
    )
}

export default CreateRoom