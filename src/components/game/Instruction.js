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
    [ACTION_CLICK_BOX, "Click a square next to one of your squares"],
    [ACTION_ENTER_WORD, "Enter a word that can be formed by your letters"]
  ])
  const prompt = promptMap.get(requiredAction)
  const whoseTurn = <span>
    It's <span id="activePlayer" style={{color: activePlayer.getColor()}}>{activePlayer.name}</span>'s turn!
  </span>
  const instruction = <div id="instruction">
    {whoseTurn} {prompt}. You've got <Countdown /> seconds...
  </div>
  return (
    <div style={{textAlign: "center", width: "80vw"}}>
      {
        winningPlayer == null
        ? (
          playerActive
          ? instruction
          : whoseTurn
        )
        : <div id="announcement">{winningPlayer != null ? winningPlayer.name : ""} won!</div>
      }
    </div>
      
  )
}

export default Instruction