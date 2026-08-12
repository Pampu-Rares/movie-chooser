import '../css/chooseMovieContainer.css'
import { socket } from "../services/socketLogic.js"
import { useState, useEffect} from 'react'
import MovieCard from "../components/MovieCard.jsx"
import MovieSelector from '../components/MovieSelector.jsx'
import MatchDialog from "../components/MatchDialog.jsx"
import MatchesList from '../components/MatchesList.jsx'

function shuffleMovies(movies) {
    for(let i = movies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movies[i], movies[j]] = [movies[j], movies[i]];
    }
    return movies;
}

function ChooseMovieGame() {
    const [isConnected, setConnected] = useState(false)
    const [socketId, setSocketId] = useState(null)
    const [movies, setMovies] = useState([
  {
    id: 1,
    name: "Inception",
    description: "Un hoț care fură secrete corporative prin utilizarea tehnologiei de partajare a viselor primește sarcina inversă: de a planta o idee în mintea unui CEO.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 2,
    name: "The Dark Knight",
    description: "Când amenințarea cunoscută sub numele de Joker provoacă haos în Gotham, Batman trebuie să accepte una dintre cele mai mari provocări psihologice și fizice.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 3,
    name: "Interstellar",
    description: "O echipă de exploratori călătorește prin spațiu printr-o gaură de vierme, în încercarea de a asigura supraviețuirea omenirii.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 4,
    name: "Pulp Fiction",
    description: "Viețile a doi ucigași plătiți, ale unui boxer, ale soției unui gangster și ale doi bandiți de rând se împletesc în patru povești de violență și mântuire.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 5,
    name: "The Matrix",
    description: "Un hacker descoperă de la rebeli misterioși natura reală a realității sale și rolul său în războiul împotriva controlorilor acesteia.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 6,
    name: "Fight Club",
    description: "Un angajat de birou insomniat și un producător de săpun nepăsător formează un club de luptă underground care evoluează în ceva mult mai mare.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 7,
    name: "Forrest Gump",
    description: "Președinții Statelor Unite, evenimentele istorice majore și cultura pop se derulează prin perspectiva unui om din Alabama cu un IQ de 75.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 8,
    name: "Spirited Away",
    description: "În timpul mutării familiei sale la suburbii, o fetiță de 10 ani rătăcește într-o lume guvernată de zei, vrăjitoare și spirite, unde părinții ei sunt transformați în porci.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 9,
    name: "Parasite",
    description: "Lăcomia și discriminarea de clasă amenință relația simbiotică nou formată dintre bogata familie Park și clanul sărac Kim.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: 10,
    name: "Whiplash",
    description: "Un tânăr tobosar promițător se înscrie la un conservator de muzică de elită, unde măiestria sa este testată brutal de un instructor nemilos.",
    posterHref: "https://m.media-amazon.com/images/M/MV5BYjdlODkxMGQtYzhjMy00NDI5LTg2NjItODZhZTY5NDMzMWEyXkEyXkFqcGc@._V1_.jpg"
  }
]
)
    const [currentMovieOption, setCurrentMovieOption] = useState({index: 0, movie: movies[0]})
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [currentMatch, setCurrentMatch] = useState({
      isMatch: false,
      movie: null
    })
    const [matchesList, setMatchesList] = useState([])

    useEffect(() => {
        /*

        const handleConnection = () => {
            setConnected(true)
            setSocketId(socket.id)
        }

        const handleMovies = (movies) => {
            const shuffledMovies = shuffleMovies(movies)
            console.log(shuffledMovies)
            setMovies(shuffledMovies)
            setCurrentMovieOption({
                index: 0,
                movie: shuffledMovies[0]
            })
        }


        socket.on('connect', handleConnection)
        socket.on('movies', handleMovies)

        socket.connect()
        
        return () => {
            socket.off('connect', handleConnection)
            socket.off('movies', handleMovies)
        }
        */
    }, [])

    const nextMovie = () => {
        const newIndex = currentMovieOption.index + 1
        setCurrentMovieOption({
            index: newIndex,
            movie: movies[newIndex]
        })
    }

    const handleLike = () => {
      setLike(true)
      setTimeout(() => {
        setCurrentMatch({
          isMatch: true,
          movie: currentMovieOption
        })
      }, 300)
      setTimeout(() => {
          
          setLike(false)
          nextMovie()
      }, 750)
    }

    const handleDislike = () => {
        setDislike(true)
        setTimeout(() => {
            setDislike(false)
            nextMovie()
        }, 750)
    }

    const skipMatch = () => {
      setMatchesList(prev => [...prev, currentMatch.movie])
      setCurrentMatch(prev => ({
        ...prev,
        isMatch: false,
      }))
      setTimeout(() => {
        setCurrentMatch(prev => ({
          ...prev,
          movie: null,
        }))
      }, 1000)
    }

    return (
        <>
          <div id='game-container' className={currentMatch.isMatch ? 'blur' : ''}>
              <p>Socket id: {socketId}</p>
              {movies && movies.length && (currentMovieOption.index >= movies.length ? <MatchesList matches={matchesList}/> : <MovieSelector movie={currentMovieOption.movie} handleDislike={handleDislike} handleLike={handleLike} like={like} dislike={dislike}/>)}
          </div>
          <MatchDialog match={currentMatch} skipMatch={skipMatch}/>
        </>
    )
}

export default ChooseMovieGame