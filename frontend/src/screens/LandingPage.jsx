import { useNavigate } from 'react-router-dom'
import '../css/landingPage.css'
import { useEffect, useState } from 'react'
import { socket } from '../services/socketLogic'

function LandingPage() {
    const navigate = useNavigate()
    const [moviePoster, setMoviePoster] = useState('landingPagePosters/poster_1.jpg')
    const [hiddenPoster, setHiddenPoster] = useState(false)
    let moviePosters = [
        'landingPagePosters/poster_1.jpg',
        'landingPagePosters/poster_2.jpg',
        'landingPagePosters/poster_3.jpg',
        'landingPagePosters/poster_4.jpg',
        'landingPagePosters/poster_5.jpg',
    ]

    useEffect(() => {
        let interval, index = 0
        const changePosters = () => {
            interval = setInterval(() => {
                setHiddenPoster(true)
                setTimeout(() => {
                    setMoviePoster(moviePosters[++index])
                    setTimeout(() => {
                        setHiddenPoster(false)
                    }, 10)
                }, 520)
                if(index === moviePosters.length - 1) index = 0
            }, 5000)
        }

        if(socket.connected) {
            const oldRoom = JSON.parse(sessionStorage.getItem('room'))
            if(oldRoom) {
                socket.emit('deleteRoom', oldRoom.code, () => {
                    socket.disconnect()
                    sessionStorage.removeItem('room')
                })
            }
        }

        changePosters()
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div id="landing-page">
            <h1 id='landing-page-title'>Movie Finder</h1>
            <p id='landing-page-desc'>The site which helps you decide on what to watch with your friends</p>
            <div id="photo-loader">
                <img src={moviePoster} className={hiddenPoster ? 'hidden' : ''}/>
            </div>
            <div id="play-buttons">
                <button id="join-room-btn" onClick={() => navigate('/joinRoom')}>Join</button>
                <button id="create-room-btn" onClick={() => navigate('/createRoom')}>Create</button>
            </div>
        </div>
    )
}

export default LandingPage