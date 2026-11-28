import '../css/wishlistPage.css'
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

function Wishlist() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const wishlistedMovies = JSON.parse(localStorage.getItem('wishlisted_movies'))
        setMovies(wishlistedMovies)
    }, [])
    return (
        <div id='wishlist-page'>
            <h1>Wishlist</h1>
            <h3>The movies you want to watch.</h3>
            {!movies ?
            <p id='zero-wishlists'>There are no wishlisted movies as of yet. Play Movie Finder or explore movies on the <em>Popular Movies Page</em> to find movies to watch.</p>
            : <div id='wishlisted-movies-container'>
                    {movies.map(movie => {
                        <MovieCard movie={movie} key={movie.id} />
                    })}
                </div>}
        </div>
    )
}

export default Wishlist