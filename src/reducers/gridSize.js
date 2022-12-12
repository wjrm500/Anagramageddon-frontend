export const SET_GRID_SIZE = 'SET_GRID_SIZE'

export const INIT_GRID_SIZE = 5

export const gridSizeReducer = (gridSize = INIT_GRID_SIZE, action) => {
  switch (action.type) {
    case SET_GRID_SIZE:
      return action.gridSize
    default:
      return gridSize
  }
}