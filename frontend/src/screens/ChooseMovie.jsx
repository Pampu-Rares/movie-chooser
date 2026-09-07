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

    const [socketId, setSocketId] = useState(socket.id)
    const [movies, setMovies] = useState([])
    const [currentMovieOption, setCurrentMovieOption] = useState({index: 0, movie: null})
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [currentMatch, setCurrentMatch] = useState({
      isMatch: false,
      movie: null
    })
    const [matchesList, setMatchesList] = useState([])
    const [roundsPlayed, setRoundsPlayed] = useState(0)

    //room deletion edge case
    useEffect(() => {
      const handleRoomDeletion = () => {
        sessionStorage.removeItem('joinedRoom')
        navigate('/joinRoom')
      }

      socket.on('deletedRoom', handleRoomDeletion)

      return () => {
        socket.off('deletedRoom', handleRoomDeletion)
      }
    }, [])

    //refresh disconnection edge case
    useEffect(() => {
        const handleConnection = () => {
            setSocketId(socket.id)
            let roomAdmin = sessionStorage.getItem('room')
            if(roomAdmin) {
              roomAdmin = JSON.parse(roomAdmin)
              socket.emit('rejoinAdmin', roomAdmin.code, roomAdmin.id, () => {
                  sessionStorage.setItem('room', JSON.stringify({
                      ...roomAdmin,
                      id: socket.id
                  }))
              })
              return ;
            }
            const previouslyJoinedRoom = JSON.parse(sessionStorage.getItem('joinedRoom'))
            if(previouslyJoinedRoom && previouslyJoinedRoom.id !== socket.id) {
                socket.emit('rejoinRoom', previouslyJoinedRoom.code, previouslyJoinedRoom.id, () => {
                    sessionStorage.setItem('joinedRoom', JSON.stringify({
                        ...previouslyJoinedRoom,
                        id: socket.id
                    }))
                })
            }
        }
        if(!socket.connected) {
            socket.connect()
            socket.once('connect', handleConnection)
        }
    }, [])

    useEffect(() => {
        const handleMovies = (movies) => {
          const shuffledMovies = shuffleMovies(movies)
          console.log(shuffledMovies)
          setMovies(shuffledMovies)
          setMatchesList([])
          setRoundsPlayed(1)
          setCurrentMatch({
            isMatch: false,
            movie: null
          })
          setCurrentMovieOption({
            index: 0,
            movie: shuffledMovies[0]
          })
        }

        const handleMatch = movieId => {
          const movieMatch = movies.find(movie => movie.id === movieId)
          console.log(matchesList.length)
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
    }, [movies.length, matchesList.length, roundsPlayed])

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
              <p>Socket id: {socketId}</p>
              {movies && movies.length && (currentMovieOption.index >= movies.length ? <MatchesList matches={matchesList} roomCode={roomCode}/> : <MovieSelector movie={currentMovieOption.movie} handleDislike={handleDislike} handleLike={handleLike} like={like} dislike={dislike}/>)}
          </div>
          <MatchDialog match={currentMatch} skipMatch={skipMatch}/>
        </>
    )
}

export default ChooseMovieGame