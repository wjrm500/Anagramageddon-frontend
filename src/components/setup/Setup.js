import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Setup = () => {
  const navigate = useNavigate()
  const [gridSize, setGridSize] = useState(5)
  const [winningScore, setWinningScore] = useState(25)
  const [maxCountdownSeconds, setMaxCountdownSeconds] = useState(15)
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
                 onChange={(e) => setGridSize(parseInt(e.target.value))}
                 min="5"
                 max="15" />
        </div>
        <div className="formComponent">
          <label>Winning score {!isNaN(gridSize) ? "(" + gridSize + " - " + gridSize * 10 + ")" : ""} </label>
          <input type="number"
                 value={!isNaN(winningScore) ? winningScore : ""}
                 onChange={(e) => setWinningScore(parseInt(e.target.value))}
                 min={!isNaN(gridSize) ? gridSize : ""}
                 max={!isNaN(gridSize) ? gridSize * 10 : ""} />
        </div>
        <div className="formComponent">
          <label>Turn time limit (5 - 30)</label>
          <input type="number"
                 value={!isNaN(maxCountdownSeconds) ? maxCountdownSeconds : ""}
                 onChange={(e) => setMaxCountdownSeconds(parseInt(e.target.value))}
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