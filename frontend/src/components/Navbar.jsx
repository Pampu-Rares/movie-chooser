
import { NavLink } from 'react-router-dom'
import '../css/navbar.css'
import { useState } from 'react'

function Navbar() {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false)
    
    const handleNavbarOpen = () => {
        setIsBurgerOpen(isOpen => !isOpen)
    }

    return (
        <nav>
            <div id='mobile-navbar'>
                <button id='open-mobile-navbar' onClick={handleNavbarOpen}>§</button>
                <div id='mobile-navbar-paths' className={isBurgerOpen ? 'open-navbar': 'closed-navbar'}>
                    <NavLink to={'/popularMovies'} id="popular-movies-link-mobile">Popular</NavLink>
                    <NavLink to={'/joinRoom'}>Join room</NavLink>
                    <NavLink to={'/createRoom'}>Create room</NavLink>
                </div>
            </div>
            <NavLink to={'/popularMovies'} id="popular-movies-link">Popular</NavLink>
            <NavLink to={'/'} id="navbar-title">Movie Chooser</NavLink>
            <NavLink to={'/joinRoom'}>Join room</NavLink>
        </nav>
    )
}

export default Navbar