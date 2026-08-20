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
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000
    }
})

const rooms = new Map()
const userRooms = new Map()

io.on('connection', async (socket) => {
    console.log('Connected: ' + socket.id)

    socket.on('createRoom', (username, handleRoomCode) => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        rooms.set(code, {
            users: [{
                id: socket.id,
                name: username
            }],
            admin: socket.id
        })
        userRooms.set(socket.id, code)
        socket.join(code)
        handleRoomCode(code)
    })
    socket.on('joinRoom', (code, username, handleJoin) => {
        const currentRoom = rooms.get(code) // check if it doesnt exist
        if(currentRoom === undefined) {
            handleJoin(false)
            return ;
        }
        const newUsersArray = [...currentRoom.users, {
            id: socket.id,
            name: username
        }]
        const updatedRoom = {
            ...currentRoom,
            users: newUsersArray
        }
        rooms.set(code, updatedRoom)
        userRooms.set(socket.id, code)
        io.to(code).emit('userJoin', socket.id, newUsersArray)
        socket.join(code)
        handleJoin(true)
    })

    socket.on('getRoomUsers', (code, handleRoomUsers) => {
        const room = rooms.get(code)
        if(!room) return ;
        handleRoomUsers(room.users)
    })
    
    socket.on('startGame', async (room) => {
        io.to(room).emit('startGame')
        try {
            const movies = await getGameMovies(10, apiKey)
            const likedMovies = {}
            movies.forEach(movie => {likedMovies[movie.id] = 0});
            const currentRoom = rooms.get(room)
            rooms.set(room, {
                ...currentRoom,
                likedMovies: likedMovies
            })
            io.to(room).emit('movies', movies)
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
            io.to(code).emit('match', movieId)
    })

    socket.on('leaveRoom', (code, leaveRoom) => {
        const oldRoom = rooms.get(code)
        if(!oldRoom) return ;
        const newUsers = oldRoom.users.filter(user => user.id !== socket.id)
        rooms.set(code , {
            ...oldRoom,
            users: newUsers
        })
        leaveRoom()
        userRooms.delete(socket.id)
        socket.to(code).emit('userLeft', socket.id, newUsers)
    })
    
    socket.on('kickUser', (userId, code) => {
        const room = rooms.get(code)
        if(!room) return ;
        io.to(userId).emit('kickedOut')
        const newUsers = room.users.filter(user => user.id !== userId)
        rooms.set(code, {
            ...room,
            users: newUsers
        })
        userRooms.delete(userId)
        io.to(code).emit('userLeft', userId, newUsers) // maybe i should implement a different message to emit
    })

    socket.on('rejoinAdmin', (code, oldId) => {
        const oldRoom = rooms.get(code)
        if(!oldRoom) return ;
        const newUsers = oldRoom.users.map(user => {
            let newId = user.id
            if(user.id === oldId) newId = socket.id
            return ({
                id: newId,
                name: user.name
            })
        })
        rooms.set(code, {
            ...oldRoom,
            users: newUsers,
            admin: socket.id
        })
        console.log(newUsers)
        userRooms.delete(oldId)
        userRooms.set(socket.id, code)
        io.to(code).emit('userJoin', socket.id, newUsers)
    })

    socket.on('deleteRoom', (code, handleAdminDeletion) => {
        //should add safety checks
        const oldRoom = rooms.get(code)
        if(!oldRoom) return ;
        socket.to(code).emit('deletedRoom')
        rooms.delete(code)
        oldRoom.users.forEach(user => {
            userRooms.delete(user.id)
        })
        handleAdminDeletion()
        io.in(code).socketsLeave(code)
    })
    socket.on('disconnect', () => {
        console.log('Disconected: ' +  socket.id)
    })
})
