import '../css/createRoom.css'
import {useState, useRef, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'


function CreateRoom() {
    const navigate = useNavigate()
    const [selectedSource, setSelectedSource] = useState('ms-all')
    const [countryCode, setCountryCode] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const countryCodeRef = useRef(null)

    useEffect(() => {
        countryCodeRef.current = countryCode
    }, [countryCode])

    const handleMSChange = (source) => {
        setSelectedSource(source)
        if(!countryCodeRef.current) {
            const getCountryCode = async () => {
                try {
                    const countryCodeJson = await fetch('https://ipapi.co/json')
                    const data = await countryCodeJson.json()
                    setCountryCode(data.country_code)
                } catch(err) {
                    console.log(err.message)
                }
            }
            getCountryCode()
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if(password==="null") alert('Password cannot be "null"')
        else setShowDialog(true)
    }
    const handleCancel = () => {
        setShowDialog(false)
    }

    const handleNameEnter = () => {
        if(!username.trim().length) alert('Enter a valid username')
            else navigate('/manageRoom?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password.trim() || null) + '&ms='+ selectedSource + '&country_code=' + countryCodeRef.current)
    }

    return (
        <div id='create-room-container'>
            <h1>Create Room</h1>
            <form id='create-room-form' className={!showDialog ? 'visible' : 'hidden'} onSubmit={handleFormSubmit}>
                <div id='password-container'>
                    <label htmlFor='room-password'>Room password</label>
                    <input id='room-password' value={password} onChange={(e) => setPassword(e.target.value)}type='text' maxLength={20} placeholder='Optional'></input>
                </div>
                <p id='ms-label'>Movie Source</p>
                <div id='movie-source'>
                    <p id='ms-all' className={selectedSource === 'ms-all' ? 'selected' : ''} onClick={() => {handleMSChange('ms-all')}}>All</p>
                    <p id='ms-netflix' className={selectedSource === 'ms-netflix' ? 'selected' : ''} onClick={() => {handleMSChange('ms-netflix')}}>Netflix</p>
                    <p id='ms-disney' className={selectedSource === 'ms-disney' ? 'selected' : ''} onClick={() => {handleMSChange('ms-disney')}}>Disney +</p>
                    <p id='ms-hbo' className={selectedSource === 'ms-hbo' ? 'selected' : ''} onClick={() => {handleMSChange('ms-hbo')}}>Hbo Max</p>
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
                <div id='buttons-div'>
                    <button id='enter-username' onClick={handleNameEnter}>Enter</button>
                    <button id='cancel' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default CreateRoom