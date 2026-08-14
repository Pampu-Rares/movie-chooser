import { useState } from 'react'
import './css/App.css'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './screens/LandingPage'
import Navbar from './components/Navbar'
import PopularMovies from './screens/PopularMovies'
import CreateRoom from './screens/CreateRoom'
import ChooseMovieGame from './screens/ChooseMovie'
import RoomManager from './screens/RoomManager'
import JoinRoom from './screens/JoinRoom'

function App() {

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/popularMovies' element={<PopularMovies />} />
          <Route path='/createRoom' element={<CreateRoom />} />
          <Route path='/findMovie' element={<ChooseMovieGame />} />
          <Route path='/manageRoom' element={<RoomManager />} />
          <Route path='/joinRoom' element={<JoinRoom />} />
        </Routes>
      </main>
    </>
  )
}

export default App
