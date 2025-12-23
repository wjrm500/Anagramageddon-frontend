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
    [ACTION_CLICK_BOX, "Tap a square next to yours"],
    [ACTION_ENTER_WORD, "Enter a word using your letters"]
  ])
  const prompt = promptMap.get(requiredAction)

  const whoseTurn = (
    <span className="turnIndicator">
      <span id="activePlayer" style={{color: activePlayer.getColor()}}>{activePlayer.name}</span>'s turn
    </span>
  )

  const instruction = (
    <div id="instruction">
      <div className="turnLine">{whoseTurn}</div>
      <div className="promptLine">{prompt}</div>
      <div className="timerLine">
        <Countdown /> seconds remaining
      </div>
    </div>
  )

  return (
    <>
      {winningPlayer == null ? (
        playerActive ? instruction : (
          <div id="instruction">
            <div className="turnLine">{whoseTurn}</div>
            <div className="promptLine waitingText">Waiting for their move...</div>
          </div>
        )
      ) : (
        <div id="announcement">
          <span style={{color: winningPlayer.getColor()}}>{winningPlayer.name}</span> won!
        </div>
      )}
    </>
  )
}

export default Instruction
