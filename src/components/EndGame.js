import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import '../css/EndGame.css'

const EndGame = () => {
  const navigate = useNavigate()
  const winningPlayer = useSelector(state => state.winningPlayer)
  const playerCollection = useSelector(state => state.playerCollection)

  const players = playerCollection ? playerCollection.getPlayers() : []
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

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
              <span className="winnerLabel">wins!</span>
            </div>
          )}
        </section>

        <section className="endGameSection">
          <div className="finalScoreTable">
            {sortedPlayers.map((player, index) => (
              <div key={player.name} className="finalScoreRow">
                <span className="playerRank">{index + 1}</span>
                <span className="playerName" style={{color: player.getColor()}}>
                  {player.name}
                </span>
                <span className="playerFinalScore">{player.score}</span>
              </div>
            ))}
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
