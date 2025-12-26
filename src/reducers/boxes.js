import { Box } from "../non-components/Box"

// WebSocket / Redux actions
export const CLICK_BOX = 'CLICK_BOX'

// Redux actions
export const SET_BOXES = 'SET_BOXES'
export const ADD_LOCK = 'ADD_LOCK'
export const REMOVE_LOCK = 'REMOVE_LOCK'

const createBoxMap = (boxData) => {
  const map = {}
  for (const x in boxData) {
    map[x] = {}
    for (const y in boxData[x]) {
      const box = boxData[x][y]
      map[x][y] = new Box(box)
    }
  }
  return map
}

export const boxesReducer = (boxes = {}, action) => {
  switch (action.type) {
    case CLICK_BOX:
      // For fast local rendering of updated grid for active client, pre-empting server confirmation
      // Makes box clicking feel more responsive when run in production
      const clickedBox = boxes[action.coords.x][action.coords.y]
      clickedBox.setPlayer(action.activePlayer)
      return boxes
    case ADD_LOCK:
      const boxToLock = boxes[action.coords.x][action.coords.y]
      boxToLock.addLock()
      return boxes
    case REMOVE_LOCK:
      const boxToUnlock = boxes[action.coords.x][action.coords.y]
      boxToUnlock.removeLock()
      return boxes
    case SET_BOXES:
      return createBoxMap(action.boxes)
    default:
      return boxes
  }
}