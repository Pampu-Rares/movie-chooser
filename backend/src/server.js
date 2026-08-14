import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { getPopularMovies, searchMovies, getGameMovies } from './tmdbApiCalls.js'
//import handleDisconnect from './handleSocketDisconnect.js'


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

const rooms = new Map()
const userRooms = new Map()

io.on('connection', async (socket) => {
    console.log('Connected: ' + socket.id)
    socket.on('createRoom', () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        rooms.set(code, {
            users: [socket.id],
            admin: socket.id
        })
        socket.join(code)
        socket.emit('roomCode', code)
    })
    socket.on('joinRoom', ([code, username]) => {
        const currentRoom = rooms.get(code) // check if it doesnt exist
        const updatedRoom = {
            ...currentRoom,
            users: [...currentRoom.users, socket.id]
        }
        rooms.set(code, updatedRoom)
        userRooms.set(socket.io, code)
        io.to(code).emit('userJoin', username) // not enough
        socket.join(code)
    })
    socket.on('startGame', async (room) => {
        try {
            const movies = await getGameMovies(10, apiKey)
            const likedMovies = {}
            movies.results.forEach(movie => likedMovies.add(movie.id, 0));
            // should check if all this is good
            socket.to(room).emit('movies', movies)
        } catch(err) {
            socket.emit('api-error')
            console.log('Error: ' + err.message || err)
        }
    })
    socket.on('likedMovie', (movieId, code) => {
        const currentRoom = rooms.get(code)
        const updatedLikedMovies = currentRoom.likedMovies
        updatedLikedMovies[movieId] += 1

        const updatedRoom = {
            ...currentRoom,
            likedMovies: updatedLikedMovies
        }
        if(updatedLikedMovies[movieId] > Math.floor(currentRoom.users.length / 2))
            socket.to(code).emit('match', movieId)
    })

    socket.on('disconnect', () => {
    })
})
