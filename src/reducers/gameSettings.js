// Redux actions
export const SET_GAME_SETTINGS = "SET_GAME_SETTINGS"
export const SET_PREVIOUS_GAME_ID = "SET_PREVIOUS_GAME_ID"

const initialGameSettings = {
  previousGameId: null,
  gridSize: null,
  winningScore: null,
  maxCountdownSeconds: null,
  volatileBoxes: false,
  volatility: 50
}

export const gameSettingsReducer = (gameSettings = initialGameSettings, action) => {
  switch (action.type) {
    case SET_GAME_SETTINGS:
      return {
        ...gameSettings,
        ...action.settings
      }
    case SET_PREVIOUS_GAME_ID:
      return {
        ...gameSettings,
        previousGameId: action.gameId
      }
    default:
      return gameSettings
  }
}
