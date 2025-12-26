import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import '../css/EndGame.css'

const EndGame = () => {
  const navigate = useNavigate()
  const winningPlayer = useSelector(state => state.winningPlayer)
  const playerCollection = useSelector(state => state.playerCollection)
  const endedByAbandonment = useSelector(state => state.endedByAbandonment)

  const players = playerCollection ? playerCollection.getPlayers() : []

  // Separate active players from removed players
  const activePlayers = players.filter(p => !p.removed)
  const removedPlayers = players.filter(p => p.removed)

  // Sort active players by score (descending), removed players stay at the bottom
  const sortedActivePlayers = [...activePlayers].sort((a, b) => b.score - a.score)
  const sortedPlayers = [...sortedActivePlayers, ...removedPlayers]

  // Determine winner label
  const winnerLabel = endedByAbandonment ? 'wins by abandonment' : 'wins!'

  return (
    <div id="container">
      <Header />
      <div className="endGameContent">
        <section className="endGameSection">
          <h2 className="endGameTitle">Game over</h2>
          {winningPlayer && (
            <div className="winnerAnnouncement">
              <span className="winnerName" style={{color: winningPlayer.getColor()}}>
                {winningPlayer.name}
              </span>
              <span className="winnerLabel">{winnerLabel}</span>
            </div>
          )}
        </section>

        <section className="endGameSection">
          <div className="finalScoreTable">
            {sortedPlayers.map((player, index) => {
              const isRemoved = player.removed
              const rowClasses = ['finalScoreRow', isRemoved ? 'removed' : ''].filter(Boolean).join(' ')
              // Only show rank for active players
              const rank = isRemoved ? '-' : (sortedActivePlayers.indexOf(player) + 1)

              return (
                <div key={player.name} className={rowClasses}>
                  <span className="playerRank">{rank}</span>
                  <span className="playerName" style={{color: isRemoved ? '#666' : player.getColor()}}>
                    {player.name}
                  </span>
                  <span className="playerFinalScore">{isRemoved ? 0 : player.score}</span>
                </div>
              )
            })}
          </div>
        </section>

        <button className="menuButton" onClick={() => navigate("/")}>
          Back to home
        </button>
      </div>
    </div>
  )
}

export default EndGame
