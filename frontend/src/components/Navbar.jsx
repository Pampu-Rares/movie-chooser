
import { NavLink } from 'react-router-dom'
import '../css/navbar.css'

function Navbar() {
    return (
        <nav>
            <NavLink to={'/popularMovies'} id="popular-movies-link">Popular</NavLink>
            <NavLink to={'/'} id="navbar-title">Movie Chooser</NavLink>
            <NavLink to={'/findMovie'}>Join room</NavLink>
        </nav>
    )
}

export default Navbar