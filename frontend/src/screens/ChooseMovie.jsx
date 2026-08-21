import '../css/chooseMovieContainer.css'
import { socket } from "../services/socketLogic.js"
import { useState, useEffect} from 'react'
import MovieSelector from '../components/MovieSelector.jsx'
import MatchDialog from "../components/MatchDialog.jsx"
import MatchesList from '../components/MatchesList.jsx'
import { useSearchParams } from 'react-router-dom'

function shuffleMovies(movies) {
    for(let i = movies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movies[i], movies[j]] = [movies[j], movies[i]];
    }
    return movies;
}

function ChooseMovieGame() {
    const [searchParams] = useSearchParams()
    const roomCode = searchParams.get('roomCode')

    const [movies, setMovies] = useState([])
    const [currentMovieOption, setCurrentMovieOption] = useState({index: 0, movie: null})
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [currentMatch, setCurrentMatch] = useState({
      isMatch: false,
      movie: null
    })
    const [matchesList, setMatchesList] = useState([])

    useEffect(() => {
        const handleMovies = (movies) => {
          const shuffledMovies = shuffleMovies(movies)
          setMovies(shuffledMovies)
          setCurrentMovieOption({
            index: 0,
            movie: shuffledMovies[0]
          })
        }

        const handleMatch = movieId => {
          const movieMatch = movies.find(movie => movie.id === movieId)
          if(!matchesList.includes(movieMatch)) {
            setMatchesList(prev => [...prev, movieMatch])
            setCurrentMatch({
              isMatch: true,
              movie: movieMatch
            })
          }
        }

        socket.on('movies', handleMovies)
        socket.on('match', handleMatch)
        
        return () => {
            socket.off('movies', handleMovies)
            socket.off('match', handleMatch)

        }
    }, [movies.length, matchesList.length])

    const nextMovie = () => {
        const newIndex = currentMovieOption.index + 1
        setCurrentMovieOption({
            index: newIndex,
            movie: movies[newIndex]
        })
    }

    const handleLike = () => {
      setLike(true)
      socket.emit('likedMovie', currentMovieOption.movie.id, roomCode)
      setTimeout(() => {
          nextMovie()
          setTimeout(() => {
            setLike(false)
          }, 250)
      }, 500)
    }

    const handleDislike = () => {
        setDislike(true)
        setTimeout(() => {
            nextMovie()
            setTimeout(() => {
            setDislike(false)
            }, 250)
        }, 500)
    }

    const skipMatch = () => {
      setCurrentMatch(prev => ({
        ...prev,
        isMatch: false,
      }))
      setTimeout(() => {
        setCurrentMatch(prev => ({
          ...prev,
          movie: currentMovieOption.movie,
        }))
      }, 1000)
    }

    return (
        <>
          <div id='game-container' className={currentMatch.isMatch ? 'blur' : ''}>
              <p>Socket id: {socket.id}</p>
              {movies && movies.length && (currentMovieOption.index >= movies.length ? <MatchesList matches={matchesList} roomCode={roomCode}/> : <MovieSelector movie={currentMovieOption.movie} handleDislike={handleDislike} handleLike={handleLike} like={like} dislike={dislike}/>)}
          </div>
          <MatchDialog match={currentMatch} skipMatch={skipMatch}/>
        </>
    )
}

export default ChooseMovieGame