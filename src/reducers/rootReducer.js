import { combineReducers } from 'redux'
import { actionFeedReducer } from './actionFeed'
import { boxesReducer } from './boxes'
import { countdownSecondsReducer } from './countdownSeconds'
import { creatorPlayerIndexReducer } from './creatorPlayerIndex'
import { disconnectedLobbyPlayersReducer } from './disconnectedLobbyPlayers'
import { disconnectedPlayersReducer } from './disconnectedPlayers'
import { endedByAbandonmentReducer } from './endedByAbandonment'
import { gridSizeReducer } from './gridSize'
import { playerCollectionReducer } from './playerCollection'
import { playerIndexReducer } from './playerIndex'
import { requiredActionReducer } from './requiredAction'
import { textFlashReducer } from './textFlash'
import { winningPlayerReducer } from './winningPlayer'
import { winningScoreReducer } from './winningScore'
import { wordInputReducer } from './wordInput'

// Global action to reset all game state
export const RESET_GAME_STATE = 'RESET_GAME_STATE'

const appReducer = combineReducers({
  actionFeed: actionFeedReducer,
  boxes: boxesReducer,
  countdownSeconds: countdownSecondsReducer,
  creatorPlayerIndex: creatorPlayerIndexReducer,
  disconnectedLobbyPlayers: disconnectedLobbyPlayersReducer,
  disconnectedPlayers: disconnectedPlayersReducer,
  endedByAbandonment: endedByAbandonmentReducer,
  gridSize: gridSizeReducer,
  playerCollection: playerCollectionReducer,
  playerIndex: playerIndexReducer,
  requiredAction: requiredActionReducer,
  textFlash: textFlashReducer,
  winningPlayer: winningPlayerReducer,
  winningScore: winningScoreReducer,
  wordInput: wordInputReducer
})

// Root reducer that handles RESET_GAME_STATE
export const rootReducer = (state, action) => {
  if (action.type === RESET_GAME_STATE) {
    // Reset state to undefined, which causes each reducer to return its initial state
    state = undefined
  }
  return appReducer(state, action)
}