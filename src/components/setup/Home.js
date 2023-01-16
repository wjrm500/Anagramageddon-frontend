import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div id="container">
      <Header />
      <button className="menuButton" onClick={() => navigate("/setup")}>New game</button>
      <button className="menuButton" onClick={() => navigate("/help")}>How to play</button>
    </div>
  )
}

export default Home