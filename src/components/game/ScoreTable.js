import React from 'react'
import { useSelector } from 'react-redux'

const truncateName = (name, maxLength = 7) => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength - 1) + '…'
}

const ScoreTable = () => {
  const playerCollection = useSelector(state => state.playerCollection)
  const playerIndex = useSelector(state => state.playerIndex)
  const players = playerCollection.getPlayers()
  const activePlayerIndex = playerCollection.getActiveIndex()

  const cells = players.map((player, index) => {
    const isActive = index === activePlayerIndex
    const isCurrentPlayer = index === playerIndex
    return (
      <div
        key={player.name}
        className={`score-cell ${isActive ? 'active' : ''} ${isCurrentPlayer ? 'current' : ''}`}
      >
        <span className="player-name" style={{color: player.getColor()}}>
          {truncateName(player.name)}
        </span>
        <span className="player-score">{player.score}</span>
      </div>
    )
  })

  return (
    <div id="scoreTable">
      {cells}
    </div>
  )
}

export default ScoreTable