import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './screens/LandingPage'
import Navbar from './ components/Navbar'

function App() {

  return (
    <main>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </main>
  )
}

export default App
