import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RESET_GAME_STATE } from '../../reducers/rootReducer'
import Header from '../Header'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // Reset Redux state when navigating to home
    // Note: We intentionally do NOT clear playerIndex sessionStorage here.
    // This allows users to return to an active game within the grace period
    // if they accidentally navigate away (e.g., clicking the logo).
    // The sessionStorage is properly cleaned up when:
    // - Game ends normally or by abandonment
    // - Rejoin fails (player removed after grace period)
    // - Game not found or connection closed by server
    dispatch({type: RESET_GAME_STATE})
  }, [dispatch])

  return (
    <div id="container">
      <Header />
      <button className="menuButton" onClick={() => navigate("/setup")}>New game</button>
      <button className="menuButton" onClick={() => navigate("/help")}>How to play</button>
    </div>
  )
}

export default Home