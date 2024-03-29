import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header'
import SpinningLoader from '../SpinningLoader'

const Setup = () => {  
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [gridSize, setGridSize] = useState(5)
  const [winningScore, setWinningScore] = useState(25)
  const [maxCountdownSeconds, setMaxCountdownSeconds] = useState(15)
  const [volatileBoxes, setVolatileBoxes] = useState(1)
  const [volatility, setVolatility] = useState(50)
  const onSubmit = async (evt) => {
    evt.preventDefault()
    if (isNaN(gridSize) || gridSize < 5 || gridSize > 15) {
      alert("Invalid grid size")
    } else if (isNaN(winningScore) || winningScore < gridSize || winningScore > gridSize * 10) {
      alert("Invalid winning score")
    } else if (isNaN(maxCountdownSeconds) || maxCountdownSeconds < 5 || maxCountdownSeconds > 30) {
      alert("Invalid turn time limit")
    } else if (isNaN(volatility) || volatility < 1 || volatility > 100) {
      alert("Invalid volatility %")
    } else {
      setIsLoading(true)
      fetch(`${process.env.REACT_APP_API_HTTP_URL}/create-game`, {
        method: "POST",
        body: JSON.stringify({gridSize, winningScore, maxCountdownSeconds, volatileBoxes, volatility}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data => navigate(`/${data.gameId}/lobby`))
      .finally(() => setIsLoading(false))
    }
  }
  return (
    <div id="container">
      <Header />
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
            <label>Volatile boxes</label>
            <select value={volatileBoxes} onChange={(e) => setVolatileBoxes(parseInt(e.target.value))}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          {
            volatileBoxes ?
            (
              <div className="formComponent">
                <label>Volatility %</label>
                <input type="number"
                       value={!isNaN(volatility) ? volatility : ""}
                       onChange={(e) => setVolatility(parseInt(e.target.value))}
                       min="1"
                       max="100" />
              </div>
            ) : ""
          }
          <div className="formComponent">
            {
              isLoading
              ? <button id="submitButton"><SpinningLoader /></button>
              : <button id="submitButton" className="clickable" onClick={onSubmit}>Create game</button>
            }
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default Setup