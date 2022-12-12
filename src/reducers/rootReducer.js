import { combineReducers } from 'redux'
import { clientActiveReducer } from './clientActive'
import { countdownSecondsReducer } from './countdownSeconds'
import { gridSizeReducer } from './gridSize'
import { playerCollectionReducer } from './playerCollection'
import { requiredActionReducer } from './requiredAction'
import { textFlashReducer } from './textFlash'
import { winningPlayerReducer } from './winningPlayer'
import { winningScoreReducer } from './winningScore'

export const rootReducer = combineReducers({
  clientActive: clientActiveReducer,
  countdownSeconds: countdownSecondsReducer,
  gridSize: gridSizeReducer,
  playerCollection: playerCollectionReducer,
  requiredAction: requiredActionReducer,
  textFlash: textFlashReducer,
  winningPlayer: winningPlayerReducer,
  winningScore: winningScoreReducer
})