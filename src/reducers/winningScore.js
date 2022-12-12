import { INIT_GRID_SIZE } from "./gridSize"

export const SET_WINNING_SCORE = 'SET_WINNING_SCORE'

const INIT_WINNING_SCORE = INIT_GRID_SIZE * 5

export const winningScoreReducer = (winningScore = INIT_WINNING_SCORE, action) => {
  switch (action.type) {
    case SET_WINNING_SCORE:
      return action.winningScore
    default:
      return winningScore
  }
}