import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RESET_GAME_STATE } from '../reducers/rootReducer'
import Header from './Header'
import '../css/EndGame.css'

const EndGame = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const winningPlayer = useSelector(state => state.winningPlayer)
  const playerCollection = useSelector(state => state.playerCollection)
  const endedByAbandonment = useSelector(state => state.endedByAbandonment)
  const playerIndex = useSelector(state => state.playerIndex)
  const gameSettings = useSelector(state => state.gameSettings)

  const [rematchStatus, setRematchStatus] = useState(null) // null, 'connecting', {playersJoined, totalPlayers}
  const [rematchError, setRematchError] = useState(null)
  const [isJoining, setIsJoining] = useState(false)
  const wsRef = useRef(null)
  const hasRequestedRematch = useRef(false)

  const players = playerCollection ? playerCollection.getPlayers() : []

  // Get this player's name and color for rematch
  const myPlayer = playerIndex !== null && playerCollection ? playerCollection.getPlayerByIdx(playerIndex) : null
  const myName = myPlayer ? myPlayer.name : null
  const myColor = myPlayer ? myPlayer.color : null

  // Max players for rematch (same as game limit)
  const MAX_PLAYERS = 4

  // Separate active players from removed players
  const activePlayers = players.filter(p => !p.removed)
  const removedPlayers = players.filter(p => p.removed)

  // Sort active players by score (descending), removed players stay at the bottom
  const sortedActivePlayers = [...activePlayers].sort((a, b) => b.score - a.score)
  const sortedPlayers = [...sortedActivePlayers, ...removedPlayers]

  // Determine winner label
  const winnerLabel = endedByAbandonment ? 'wins by abandonment' : 'wins!'

  // Open WebSocket on mount to listen for rematch updates
  useEffect(() => {
    if (!gameSettings.previousGameId) return

    const ws = new WebSocket(`${process.env.REACT_APP_API_WS_URL}`)
    wsRef.current = ws

    ws.onopen = () => {
      // Subscribe to rematch updates for this game
      ws.send(JSON.stringify({
        type: 'SUBSCRIBE_REMATCH_UPDATES',
        data: { gameId: gameSettings.previousGameId }
      }))
    }

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data)

      if (data.type === 'rematchStatus') {
        // Initial status when subscribing
        const { playersJoined } = data.data
        setRematchStatus({ playersJoined })
      } else if (data.type === 'rematchUpdate') {
        // Update from another player joining
        const { playersJoined } = data.data
        setRematchStatus({ playersJoined })
      } else if (data.type === 'rematchJoined') {
        // Successfully joined rematch - store playerIndex and navigate
        const { rematchGameId, playerIndex: newPlayerIndex, playersJoined } = data.data
        sessionStorage.setItem(`playerIndex_${rematchGameId}`, newPlayerIndex.toString())
        setRematchStatus({ playersJoined })
        ws.close()
        // Reset game state before navigating to clear winningPlayer etc.
        dispatch({type: RESET_GAME_STATE})
        navigate(`/${rematchGameId}/lobby`)
      } else if (data.type === 'rematchFailed') {
        setRematchError(data.data.reason)
        setIsJoining(false)
        hasRequestedRematch.current = false
      }
    }

    ws.onerror = () => {
      // Silent error - WebSocket connection failed but that's ok for passive listening
    }

    return () => {
      ws.close()
    }
  }, [gameSettings.previousGameId, dispatch, navigate])

  const handleRematchClick = () => {
    if (!gameSettings.previousGameId || !myName) {
      setRematchError('Unable to create rematch')
      return
    }

    if (isJoining || hasRequestedRematch.current) {
      return // Already processing
    }

    setIsJoining(true)
    hasRequestedRematch.current = true
    setRematchError(null)

    // Use existing WebSocket if available, otherwise create new one
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'REQUEST_REMATCH',
        data: {
          gameId: gameSettings.previousGameId,
          playerName: myName,
          preferredColor: myColor
        }
      }))
    } else {
      // Create new WebSocket if the existing one isn't connected
      const ws = new WebSocket(`${process.env.REACT_APP_API_WS_URL}`)
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'REQUEST_REMATCH',
          data: {
            gameId: gameSettings.previousGameId,
            playerName: myName,
            preferredColor: myColor
          }
        }))
      }

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data)

        if (data.type === 'rematchJoined') {
          const { rematchGameId, playerIndex: newPlayerIndex, playersJoined } = data.data
          sessionStorage.setItem(`playerIndex_${rematchGameId}`, newPlayerIndex.toString())
          setRematchStatus({ playersJoined })
          ws.close()
          dispatch({type: RESET_GAME_STATE})
          navigate(`/${rematchGameId}/lobby`)
        } else if (data.type === 'rematchFailed') {
          setRematchError(data.data.reason)
          setIsJoining(false)
          hasRequestedRematch.current = false
          ws.close()
        }
      }

      ws.onerror = () => {
        setRematchError('Connection failed')
        setIsJoining(false)
        hasRequestedRematch.current = false
      }
    }
  }

  // Determine rematch button text and subtext
  const getRematchDisplay = () => {
    if (isJoining) {
      return { text: 'Rematch', subtext: 'Joining...' }
    }
    if (rematchStatus && typeof rematchStatus === 'object') {
      return { text: 'Rematch', subtext: `(${rematchStatus.playersJoined}/${MAX_PLAYERS} joined)` }
    }
    // Show initial 0/4 when no rematch exists yet
    return { text: 'Rematch', subtext: `(0/${MAX_PLAYERS} joined)` }
  }

  const rematchDisplay = getRematchDisplay()
  const showRematchButton = myName && gameSettings.previousGameId
  // Disable if already joining, or if rematch is full (4/4)
  const isRematchFull = rematchStatus && typeof rematchStatus === 'object' && rematchStatus.playersJoined >= MAX_PLAYERS
  const isRematchDisabled = isJoining || isRematchFull

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

        <div className="endGameButtons">
          {showRematchButton && (
            <button className="rematchButton" onClick={handleRematchClick} disabled={isRematchDisabled}>
              <span className="rematchButtonText">{rematchDisplay.text}</span>
              {rematchDisplay.subtext && (
                <span className="rematchButtonSubtext">{rematchDisplay.subtext}</span>
              )}
            </button>
          )}
          {rematchError && (
            <div className="rematchError">{rematchError}</div>
          )}
          <button className="menuButton" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}

export default EndGame
