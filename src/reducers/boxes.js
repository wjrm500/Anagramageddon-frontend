import { Box } from "../non-components/Box"

// WebSocket actions
export const CLICK_BOX = 'CLICK_BOX'

// Redux actions
export const SET_BOXES = 'SET_BOXES'

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

export const boxesReducer = (boxes = [], action) => {
  switch (action.type) {
    case SET_BOXES:
      return createBoxMap(action.boxes)
    default:
      return boxes
  }
}