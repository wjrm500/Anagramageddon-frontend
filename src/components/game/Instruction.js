import React from 'react'
import { useSelector } from 'react-redux'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD } from '../../reducers/requiredAction'
import Countdown from './Countdown'

const Instruction = () => {
  const winningPlayer = useSelector(state => state.winningPlayer)
  const playerIndex = useSelector(state => state.playerIndex)
  const playerCollection = useSelector(state => state.playerCollection)
  const playerActive = playerCollection.isActiveIndex(playerIndex)
  const activePlayer = playerCollection.getActivePlayer()
  const requiredAction = useSelector(state => state.requiredAction)

  const promptMap = new Map([
    [ACTION_CLICK_BOX, "Tap a square"],
    [ACTION_ENTER_WORD, "Enter a word"]
  ])
  const prompt = promptMap.get(requiredAction)

  if (winningPlayer != null) {
    return (
      <div id="instruction" className="announcement">
        <span className="winnerName" style={{color: winningPlayer.getColor()}}>{winningPlayer.name}</span> won!
      </div>
    )
  }

  return (
    <div id="instruction">
      <span className="bullet">●</span>
      <span className="playerName" style={{color: activePlayer.getColor()}}>{activePlayer.name}</span>
      <span className="separator">·</span>
      <span className="prompt">{playerActive ? prompt : "Waiting..."}</span>
      {playerActive && (
        <>
          <span className="separator">·</span>
          <span className="timer"><Countdown />s</span>
        </>
      )}
    </div>
  )
}

export default Instruction
