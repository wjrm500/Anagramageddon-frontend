import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD } from '../../reducers/requiredAction'
import { UPDATE_GRACE_PERIOD } from '../../reducers/disconnectedPlayers'
import Countdown from './Countdown'

const Instruction = () => {
  const dispatch = useDispatch()
  const winningPlayer = useSelector(state => state.winningPlayer)
  const playerIndex = useSelector(state => state.playerIndex)
  const playerCollection = useSelector(state => state.playerCollection)
  const disconnectedPlayers = useSelector(state => state.disconnectedPlayers)
  const playerActive = playerCollection.isActiveIndex(playerIndex)
  const activePlayer = playerCollection.getActivePlayer()
  const requiredAction = useSelector(state => state.requiredAction)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Countdown timer for disconnected players
  useEffect(() => {
    const disconnectedPlayerIndices = Object.keys(disconnectedPlayers)
    if (disconnectedPlayerIndices.length === 0) return

    const interval = setInterval(() => {
      disconnectedPlayerIndices.forEach((idx) => {
        dispatch({type: UPDATE_GRACE_PERIOD, playerIndex: parseInt(idx)})
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [disconnectedPlayers, dispatch])

  const activePromptMap = new Map([
    [ACTION_CLICK_BOX, isMobile ? "Tap a square" : "Click a square"],
    [ACTION_ENTER_WORD, "Enter a word"]
  ])
  const waitingPromptMap = new Map([
    [ACTION_CLICK_BOX, "Selecting a square..."],
    [ACTION_ENTER_WORD, "Entering a word..."]
  ])
  const prompt = playerActive
    ? activePromptMap.get(requiredAction)
    : waitingPromptMap.get(requiredAction)

  if (winningPlayer != null) {
    return (
      <div id="instruction" className="announcement">
        <span className="winnerName" style={{color: winningPlayer.getColor()}}>{winningPlayer.name}</span> won!
      </div>
    )
  }

  const turnText = playerActive
    ? <span className="turnText" style={{color: activePlayer.getColor()}}>Your turn</span>
    : <><span className="playerName" style={{color: activePlayer.getColor()}}>{activePlayer.name}</span>'s turn</>

  // Get player colors for disconnection notifications
  const getPlayerColor = (playerIdx) => {
    const player = playerCollection.getPlayerByIdx(parseInt(playerIdx))
    return player ? player.getColor() : '#888'
  }

  // Count active (non-removed) players to determine message
  const activePlayers = playerCollection.getPlayers().filter(p => !p.removed)
  const disconnectedPlayerIndices = Object.keys(disconnectedPlayers)

  return (
    <div id="instruction">
      <div className="turnLine">
        <span className="turnIndicator">{turnText}</span>
        <span className="separator">·</span>
        <span className="prompt">{prompt}</span>
        <span className="separator">·</span>
        <span className="timer"><Countdown />s</span>
      </div>
      {disconnectedPlayerIndices.length > 0 && (
        <div className="disconnectionNotifications">
          {disconnectedPlayerIndices.map((idx) => {
            const { playerName, remainingSeconds } = disconnectedPlayers[idx]
            // Calculate how many players would remain when THIS player's timer expires
            // We need to account for any other disconnected players whose timers expire before this one
            const playersRemovedBeforeThis = disconnectedPlayerIndices.filter(
              otherIdx => otherIdx !== idx && disconnectedPlayers[otherIdx].remainingSeconds < remainingSeconds
            ).length
            // Active players minus those removed before this timer expires, minus this player
            const playersAfterThisRemoval = activePlayers.length - playersRemovedBeforeThis - 1
            // Game terminates if only 1 or fewer players would remain
            const willTerminate = playersAfterThisRemoval <= 1
            const action = willTerminate ? 'game will terminate' : 'they will be removed'
            return (
              <div key={idx} className="disconnectionNotice">
                <span className="disconnectedPlayerName" style={{color: getPlayerColor(idx)}}>
                  {playerName}
                </span>
                {' '}disconnected, {action} in {remainingSeconds}s
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Instruction
