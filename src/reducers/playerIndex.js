export const SET_PLAYER_INDEX = 'SET_PLAYER_INDEX'

export const playerIndexReducer = (playerIndex = null, action) => {
  switch (action.type) {
    case SET_PLAYER_INDEX:
      return action.playerIndex
    default:
      return playerIndex
  }
}