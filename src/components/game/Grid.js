import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { SET_TEXT_FLASH } from '../../reducers/textFlash'
import Box from './Box'

const Grid = () => {
  const clientActive = useSelector(state => state.clientActive)
  const active = clientActive && requiredAction == ACTION_CLICK_BOX
  const gridSize = useSelector(state => state.gridSize)
  const playerCollection = useSelector(state => state.playerCollection)
  const activePlayer = playerCollection.getActivePlayer()
  const requiredAction = useSelector(state => state.requiredAction)
  const dispatch = useDispatch()
  const postBoxClickHandler = () => dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_ENTER_WORD})
  let boxes = []
  const rows = Array(gridSize).fill().map((_, rowIdx) => {
    const row = Array(gridSize).fill().map((_, colIdx) => {
      let player
      const topLeft = rowIdx + colIdx == 0
      const bottomRight = rowIdx * colIdx == Math.pow(gridSize - 1, 2)
      const topRight = rowIdx == 0 && colIdx == gridSize - 1
      const bottomLeft = rowIdx == gridSize - 1 && colIdx == 0
      if (topLeft) {
        player = playerCollection.getPlayerByIdx(0)
      } else if (bottomRight) {
        player = playerCollection.getPlayerByIdx(1)
      } else if (topRight && playerCollection.getPlayers().length > 2) {
        player = playerCollection.getPlayerByIdx(2)
      } else if (bottomLeft && playerCollection.getPlayers().length > 3) {
        player = playerCollection.getPlayerByIdx(3)
      }
      const box = <Box defaultPlayer={player} rowIdx={rowIdx} colIdx={colIdx} activePlayer={activePlayer} active={active} postBoxClickHandler={postBoxClickHandler} setTextFlash={(textFlash) => dispatch({type: SET_TEXT_FLASH, textFlash})}/>
      boxes.push(box)
      return box
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