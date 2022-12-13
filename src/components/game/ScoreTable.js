import React from 'react'
import { useSelector } from 'react-redux'

const ScoreTable = () => {
  const playerCollection = useSelector(state => state.playerCollection)
  const players = playerCollection.getPlayers()
  const rows = players.map((player) => {
    return <tr key={player.name}>
      <td style={{color: player.getColor()}}>{player.name}</td>
      <td>{player.score}</td>
    </tr>
  })
  return (
    <table id="scoreTable">
      <thead>
        <tr>
            <th>Name</th>
            <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

export default ScoreTable