import React from 'react'
import { useSelector } from 'react-redux'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD } from '../../reducers/requiredAction'
import Countdown from './Countdown'

const Instruction = () => {
  const winningPlayer = useSelector(state => state.winningPlayer)
  const playerCollection = useSelector(state => state.playerCollection)
  const clientActive = useSelector(state => state.clientActive)
  const activePlayer = playerCollection.getActivePlayer()
  const requiredAction = useSelector(state => state.requiredAction)
  const promptMap = new Map([
    [ACTION_CLICK_BOX, "Click a square next to one of your squares"],
    [ACTION_ENTER_WORD, "Enter a word that can be formed by your letters"]
  ])
  const prompt = promptMap.get(requiredAction)
  const tup = activePlayer.color // activePlayerColorTuple
  const playerNameColor = `rgb(${tup[0]}, ${tup[1]}, ${tup[2]})`
  const instruction = <div id="instruction">
    It's <span id="activePlayer" style={{color: playerNameColor}}>{activePlayer.name}</span>'s turn! {prompt}. You've got <Countdown /> seconds...
  </div>
  return (
    <div>
      {
        winningPlayer == null
        ? (
          clientActive
          ? instruction
          : "It'll be your turn soon!"
        )
        : <div id="announcement">{winningPlayer != null ? winningPlayer.name : ""} won!</div>
      }
    </div>
      
  )
}

export default Instruction