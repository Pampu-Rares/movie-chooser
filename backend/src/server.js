import { Server } from 'socket.io'
import { getMovies } from './tmdbApiCalls.js'

const PORT = 3000
const apiKey = process.env.API_KEY

const io = new Server(PORT, {
    cors: {
        origin: '*'
    }
})

io.on('connection', async (socket) => {
    console.log('Connected: ' + socket.id)
    try {
        const movies = await getMovies(10, apiKey)
        socket.emit('movies', movies)

    } catch(err) {
        socket.emit('api-error')
        console.log('Error: ' + err.message)
    }
})

console.log('Running on port ' + PORT)
