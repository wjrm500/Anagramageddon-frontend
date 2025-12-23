import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CLICK_BOX } from '../../reducers/boxes'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { FLASH_ERROR, SET_TEXT_FLASH } from '../../reducers/textFlash'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'
import Box from './Box'

const Grid = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const playerIndex = useSelector(state => state.playerIndex)
  const playerCollection = useSelector(state => state.playerCollection)
  const playerActive = playerCollection.isActiveIndex(playerIndex)
  const gridSize = useSelector(state => state.gridSize)
  const activePlayer = playerCollection.getActivePlayer()
  const requiredAction = useSelector(state => state.requiredAction)
  const winningPlayer = useSelector(state => state.winningPlayer)
  const active = playerActive && requiredAction == ACTION_CLICK_BOX && winningPlayer == null
  const dispatch = useDispatch()
  const boxes = useSelector(state => state.boxes)
  const currentPlayer = playerCollection.players[playerIndex]
  const boxComponents = []
  const rows = Array(gridSize).fill().map((_, rowIdx) => {
    const row = Array(gridSize).fill().map((_, colIdx) => {
      const box = boxes[rowIdx][colIdx]
      const isOpponent = box.player && box.player.name !== currentPlayer.name
      const setTextFlash = (textFlash) => dispatch({type: SET_TEXT_FLASH, textFlash})
      const onClick = () => {
        if (!playerActive) return
        if (requiredAction == ACTION_ENTER_WORD) {
          setTextFlash({content: "Enter a word", status: FLASH_ERROR})
          return
        }
        if (activePlayer.canAddBox(box)) {
          dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_ENTER_WORD})
          dispatch({type: CLICK_BOX, activePlayer, coords: {x: rowIdx, y: colIdx}})
          ws.current.send(JSON.stringify({type: "CLICK_BOX", data: {gameId, x: rowIdx, y: colIdx}}))
        } else {
          setTextFlash({content: "Can't go here", status: FLASH_ERROR})
        }

      }
      const boxComponent = <Box box={box} active={active} onClick={onClick} isOpponent={isOpponent}/>
      boxComponents.push(boxComponent)
      return boxComponent
    })
    return <div className="row">{row}</div>
  })
  return (
    <div id="grid">
      {rows}
    </div>
  )
}

export default Grid