import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { getPopularMovies, searchMovies, getGameMovies } from './tmdbApiCalls.js'


const app = express()

app.use(cors({
    origin: '*'
}))

const PORT =  process.env.PORT || 3030
const apiKey = process.env.API_KEY

app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const popularMovies = await getPopularMovies()
        res.json(popularMovies)
    } catch(err) {
        console.log('API error: ' + err.message || err)
        res.status(500).json({message: "Server could not fetch popular movies"})
    }
})

app.get('/popularMovies', async (req, res) => {
    try {
        const popularMovies = await getPopularMovies()
        res.json(popularMovies)
    } catch(err) {
        console.log('API error: ' + err.message || err)
        res.status(500).json({message: "Server could not fetch popular movies"})
    }
})

app.get('/searchMovies/:query', async (req, res) => {
    try {
        const searchedMovies = await searchMovies(req.params.query)
        res.json(searchedMovies)
    } catch(err) {
        console.log('API error: ' + err.message || err)
        res.status(500).json({message: "Server could not fetch the searched movies"})
    }
})

const server = app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})

const io = new Server(server, {
    path: '/movieFinderGame/',
    cors: {
        origin: '*'
    }
})

io.on('connection', async (socket) => {
    console.log('Connected: ' + socket.id)
    try {
        const movies = await getGameMovies(10, apiKey)
        socket.emit('movies', movies)

    } catch(err) {
        socket.emit('api-error')
        console.log('Error: ' + err.message || err)
    }
})
