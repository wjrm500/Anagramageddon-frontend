import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const WinnerBanner = () => {
  const winningPlayer = useSelector(state => state.winningPlayer)
  const navigate = useNavigate()
  const onButtonClick = () => navigate("/")
  return (
    <div id="winnerBanner" class="fadeIn">
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