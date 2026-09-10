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
    const [allMovies, setAllMovies] = useState([])
    const [currentMovieOption, setCurrentMovieOption] = useState({index: 0, movie: null})
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [currentMatch, setCurrentMatch] = useState({
      isMatch: false,
      movie: null
    })
    const [matchesList, setMatchesList] = useState([])
    const [roundsPlayed, setRoundsPlayed] = useState(0)
    const [waitingForOthers, setWaitingForOthers] = useState(false)


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

    useEffect(() => {
        const handleMovies = (movies, isNewRound) => {
          console.log('Received movies')
          if(isNewRound) {
            sessionStorage.removeItem('votedMovies') // should also make sure to remove it from other pages
            setMatchesList([])
          }
          setAllMovies(movies)
          console.log(movies)
          const votedMovies = JSON.parse(sessionStorage.getItem('votedMovies'))
          let actualMovies = movies
          if(votedMovies) {
            actualMovies = movies.filter(movie => {
              for(let votedMovieId of votedMovies) {
                if(movie.id === votedMovieId) return false
            }
            if(!actualMovies.length) setWaitingForOthers(true)
            return true // not sure why I return true, maybe I'm just retarded
            })
          }  // test all of this
          const shuffledMovies = shuffleMovies(actualMovies)
          //console.log(shuffledMovies)
          setMovies(shuffledMovies)
          setRoundsPlayed(1) // do i need to reset it?
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
          setCurrentMatch({
            isMatch: true,
            movie: movieMatch
          })
        }

        socket.on('movies', handleMovies)
        socket.on('match', handleMatch)
        
        return () => {
            socket.off('movies', handleMovies)
            socket.off('match', handleMatch)
        }
    }, [movies.length, roundsPlayed])

    //final matches list
    useEffect(() => {

      const handleMatchesList = (matches) => {
        console.log('Received matches')
        console.log(allMovies)
        setMatchesList(matches.map(movieId => {
          for(const movie of allMovies)
            if(movieId === movie.id) return movie
        }))
      }
      
      socket.on('matches-list', handleMatchesList)
      return () => {
        socket.off('matches-list', handleMatchesList)
      }
    }, [allMovies.length])

    const nextMovie = () => {
        const newIndex = currentMovieOption.index + 1
        setCurrentMovieOption({
            index: newIndex,
            movie: movies[newIndex] || null
        })
        if(newIndex >= movies.length) {
          setWaitingForOthers(true)
          socket.emit('finishedVoting', roomCode)
        }
    }

    const handleLike = () => {
      setLike(true)
      socket.emit('likedMovie', currentMovieOption.movie.id, roomCode)
      const votedMovies = JSON.parse(sessionStorage.getItem('votedMovies')) || []
      votedMovies.push(currentMovieOption.movie.id)
      sessionStorage.setItem('votedMovies', JSON.stringify(votedMovies))
      setTimeout(() => {
          nextMovie()
          setTimeout(() => {
            setLike(false)
          }, 250)
      }, 500)
    }

    const handleDislike = () => {
        setDislike(true)
        const votedMovies = JSON.parse(sessionStorage.getItem('votedMovies')) || []
        votedMovies.push(currentMovieOption.movie.id)
        sessionStorage.setItem('votedMovies', JSON.stringify(votedMovies))
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
              {matchesList.length ? (
                <MatchesList matches={matchesList} roomCode={roomCode}/>
              ) : waitingForOthers ? (
                  <div id='waiting-others'>
                    <h3>Waiting for the others to finish</h3>
                  </div>
                ) : (
                movies && movies.length && <MovieSelector movie={currentMovieOption.movie} handleDislike={handleDislike} handleLike={handleLike} like={like} dislike={dislike}/>
                )}
          </div>
          <MatchDialog match={currentMatch} skipMatch={skipMatch}/>
        </>
    )
}

export default ChooseMovieGame