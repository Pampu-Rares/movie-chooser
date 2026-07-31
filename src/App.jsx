import { useState } from 'react'
import './css/App.css'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './screens/LandingPage'
import Navbar from './ components/Navbar'
import PopularMovies from './screens/PopularMovies'

function App() {

  return (
    <main>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/popularMovies' element={<PopularMovies />} />
      </Routes>
    </main>
  )
}

export default App
