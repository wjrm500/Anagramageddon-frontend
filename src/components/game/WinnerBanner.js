import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { WebSocketContext } from '../WebSocketContainer'

const WinnerBanner = () => {
  const ws = useContext(WebSocketContext)
  const winningPlayer = useSelector(state => state.winningPlayer)
  const navigate = useNavigate()
  const onButtonClick = () => {
    ws.current.close()
    navigate("/")
  }
  return (
    <div id="winnerBanner" className="fadeIn">
        <div id="winnerText">
          <span id="winningPlayer">{winningPlayer.name}</span> won the game!
        </div>
        <div>
            <button id="backToHome" onClick={onButtonClick}>
              Back to home
            </button>
        </div>
    </div>
  )
}

export default WinnerBanner