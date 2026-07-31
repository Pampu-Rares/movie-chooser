
import { NavLink } from 'react-router-dom'
import '../css/navbar.css'

function Navbar() {
    return (
        <nav>
            <NavLink to={'/popularMovies'} id="popular-movies-link">Popular</NavLink>
            <p id="navbar-title">Movie Chooser</p>
        </nav>
    )
}

export default Navbar