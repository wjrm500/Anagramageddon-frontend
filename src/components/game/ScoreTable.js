import React from 'react'
import { useSelector } from 'react-redux'

const truncateName = (name, maxLength = 10) => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength - 1) + '…'
}

const ScoreTable = () => {
  const playerCollection = useSelector(state => state.playerCollection)
  const playerIndex = useSelector(state => state.playerIndex)
  const players = playerCollection.getPlayers()
  const playerCount = players.length

  const renderCell = (player, idx) => (
    <div
      key={player.name}
      className={`score-cell ${idx === playerIndex ? 'current' : ''}`}
    >
      <span className="player-name" style={{color: player.getColor()}}>
        {truncateName(player.name)}
      </span>
      <span className="player-score">{player.score}</span>
    </div>
  )

  // 2 players: single row, player 0 left, player 1 right
  if (playerCount === 2) {
    return (
      <div id="scoreTable" className="players-2">
        {players.map((player, idx) => renderCell(player, idx))}
      </div>
    )
  }

  // 3-4 players: 2x2 grid, clockwise from top-left
  // Cell order: [TL, TR, BL, BR] → player order: [0, 1, 3, 2]
  const cellToPlayer = [0, 1, 3, 2]
  
  return (
    <div id="scoreTable" className={`players-${playerCount}`}>
      {cellToPlayer.map((playerIdx, cellIndex) => {
        const player = players[playerIdx]
        return player 
          ? renderCell(player, playerIdx)
          : <div key={`empty-${cellIndex}`} className="score-cell empty" />
      })}
    </div>
  )
}

export default ScoreTable