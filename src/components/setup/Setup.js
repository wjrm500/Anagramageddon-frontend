import React, { useContext } from 'react'
import { GridSizeContext, SetGridSizeContext } from '../../contexts/GridSizeContext'
import { SetSetupActiveContext } from '../../contexts/SetupActiveContext'
import { SetWinningScoreContext, WinningScoreContext } from '../../contexts/WinningScoreContext'

const Setup = () => {
  const gridSize = useContext(GridSizeContext)
  const setGridSize = useContext(SetGridSizeContext)
  const winningScore = useContext(WinningScoreContext)
  const setWinningScore = useContext(SetWinningScoreContext)
  const setSetupActive = useContext(SetSetupActiveContext)
  const onSubmit = () => setSetupActive(false)
  return (
    <div class="formContainer">
      <form id="setupForm" onSubmit={onSubmit}>
        <div className="formComponent">
          <label>Number of players</label>
          <input type="number" disabled value="2" />
        </div>
        <div className="formComponent">
          <label>Grid size</label>
          <input type="number" value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))} min="5" max="20" />
        </div>
        <div className="formComponent">
          <label>Winning score</label>
          <input type="number" value={winningScore} onChange={(e) => setWinningScore(parseInt(e.target.value))} min={gridSize} max={gridSize * 10} />
        </div>
        <div className="formComponent">
          <input id="submitButton" type="submit" />
        </div>
      </form>
    </div>
  )
}

export default Setup