export const SET_CREATOR_PLAYER_INDEX = 'SET_CREATOR_PLAYER_INDEX'

export const creatorPlayerIndexReducer = (creatorPlayerIndex = null, action) => {
  switch (action.type) {
    case SET_CREATOR_PLAYER_INDEX:
      return action.creatorPlayerIndex
    default:
      return creatorPlayerIndex
  }
}
