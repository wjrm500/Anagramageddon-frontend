import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SET_MAX_COUNTDOWN } from '../../reducers/countdownSeconds'
import { SET_GRID_SIZE } from '../../reducers/gridSize'
import { SET_WINNING_SCORE } from '../../reducers/winningScore'

const Setup = () => {
  const navigate = useNavigate()
  const gridSize = useSelector(state => state.gridSize)
  const winningScore = useSelector(state => state.winningScore)
  const maxCountdownSeconds = useSelector(state => state.countdownSeconds.max)
  const dispatch = useDispatch()
  const onSubmit = async (e) => {
    e.preventDefault()

    if (isNaN(gridSize) || gridSize < 5 || gridSize > 15) {
      alert("Invalid grid size")
    } else if (isNaN(winningScore) || winningScore < gridSize || winningScore > gridSize * 10) {
      alert("Invalid winning score")
    } else if (isNaN(maxCountdownSeconds) || maxCountdownSeconds < 5 || maxCountdownSeconds > 30) {
      alert("Invalid turn time limit")
    } else {
        fetch("http://localhost:8080/create-game", {
          method: "POST",
          body: JSON.stringify({gridSize, winningScore, maxCountdownSeconds}),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(data => navigate(`/game/${data.gameId}/lobby`))
    }
  }
  return (
    <div id="formContainer">
      <form id="setupForm" onSubmit={onSubmit}>
        <div className="formComponent">
          <label>Grid size (5 - 15)</label>
          <input type="number"
                 value={!isNaN(gridSize) ? gridSize : ""}
                 onChange={(e) => dispatch({type: SET_GRID_SIZE, value: parseInt(e.target.value)})}
                 min="5"
                 max="15" />
        </div>
        <div className="formComponent">
          <label>Winning score {!isNaN(gridSize) ? "(" + gridSize + " - " + gridSize * 10 + ")" : ""} </label>
          <input type="number"
                 value={!isNaN(winningScore) ? winningScore : ""}
                 onChange={(e) => dispatch({type: SET_WINNING_SCORE, value: parseInt(e.target.value)})}
                 min={!isNaN(gridSize) ? gridSize : ""}
                 max={!isNaN(gridSize) ? gridSize * 10 : ""} />
        </div>
        <div className="formComponent">
          <label>Turn time limit (5 - 30)</label>
          <input type="number"
                 value={!isNaN(maxCountdownSeconds) ? maxCountdownSeconds : ""}
                 onChange={(e) => dispatch({type: SET_MAX_COUNTDOWN, maxCountdown: parseInt(e.target.value)})}
                 min="5"
                 max="30" />
        </div>
        <div className="formComponent">
          <input id="submitButton" type="submit" />
        </div>
      </form>
    </div>
  )
}

export default Setup