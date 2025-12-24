import { combineReducers } from 'redux'
import { boxesReducer } from './boxes'
import { countdownSecondsReducer } from './countdownSeconds'
import { creatorPlayerIndexReducer } from './creatorPlayerIndex'
import { gridSizeReducer } from './gridSize'
import { playerCollectionReducer } from './playerCollection'
import { playerIndexReducer } from './playerIndex'
import { requiredActionReducer } from './requiredAction'
import { textFlashReducer } from './textFlash'
import { winningPlayerReducer } from './winningPlayer'
import { winningScoreReducer } from './winningScore'
import { wordInputReducer } from './wordInput'

export const rootReducer = combineReducers({
  boxes: boxesReducer,
  countdownSeconds: countdownSecondsReducer,
  creatorPlayerIndex: creatorPlayerIndexReducer,
  gridSize: gridSizeReducer,
  playerCollection: playerCollectionReducer,
  playerIndex: playerIndexReducer,
  requiredAction: requiredActionReducer,
  textFlash: textFlashReducer,
  winningPlayer: winningPlayerReducer,
  winningScore: winningScoreReducer,
  wordInput: wordInputReducer
})