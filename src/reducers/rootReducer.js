import { combineReducers } from 'redux'
import { boxesReducer } from './boxes'
import { countdownSecondsReducer } from './countdownSeconds'
import { gridSizeReducer } from './gridSize'
import { playerCollectionReducer } from './playerCollection'
import { playerIndexReducer } from './playerIndex'
import { requiredActionReducer } from './requiredAction'
import { textFlashReducer } from './textFlash'
import { winningPlayerReducer } from './winningPlayer'
import { winningScoreReducer } from './winningScore'

export const rootReducer = combineReducers({
  boxes: boxesReducer,
  countdownSeconds: countdownSecondsReducer,
  gridSize: gridSizeReducer,
  playerCollection: playerCollectionReducer,
  playerIndex: playerIndexReducer,
  requiredAction: requiredActionReducer,
  textFlash: textFlashReducer,
  winningPlayer: winningPlayerReducer,
  winningScore: winningScoreReducer
})