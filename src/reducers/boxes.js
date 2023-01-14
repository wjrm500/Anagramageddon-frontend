import { Box } from "../non-components/Box"

// WebSocket / Redux actions
export const CLICK_BOX = 'CLICK_BOX'

// Redux actions
export const SET_BOXES = 'SET_BOXES'
export const SET_VOLATILE_BOX = 'SET_VOLATILE_BOX'

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
    case SET_BOXES:
      return createBoxMap(action.boxes)
    case SET_VOLATILE_BOX:
      console.log("Making box volatile")
      const volatileBox = boxes[action.coords.x][action.coords.y]
      volatileBox.makeVolatile()
      console.log("volatileBox.volatile: ", volatileBox.volatile)
      console.log("boxes[action.coords.x][action.coords.y].volatile: ", boxes[action.coords.x][action.coords.y].volatile)
      return createBoxMap(boxes)
    default:
      return boxes
  }
}