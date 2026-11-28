
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
            <div id='mobile-navbar' className='nav-mobile'>
                <button id='open-mobile-navbar' onClick={handleNavbarOpen}>§</button>
                <div id='mobile-navbar-paths' className={isBurgerOpen ? 'open-navbar': 'closed-navbar'}>
                    <NavLink to={'/popularMovies'} id="popular-movies-link-mobile" onClick={() => setIsBurgerOpen(false)}>Popular movies</NavLink>
                    <NavLink to={'/createRoom'} onClick={() => setIsBurgerOpen(false)}>Create room</NavLink>
                    <NavLink to={'/joinRoom'} onClick={() => setIsBurgerOpen(false)}>Join room</NavLink>
                    <NavLink to={'/wishlist'} onClick={() => setIsBurgerOpen(false)}>Wishlist</NavLink>
                </div>
            </div>
            <NavLink to={'/popularMovies'} id="popular-movies-link" className='nav-full'>Popular</NavLink>
            <NavLink to={'/'} id="navbar-title">Movie Chooser</NavLink>
            <NavLink to={'/joinRoom'} className='nav-full'>Join room</NavLink>
        </nav>
    )
}

export default Navbar