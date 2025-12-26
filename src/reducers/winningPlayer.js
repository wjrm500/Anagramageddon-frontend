import { calculateWinningPlayer } from "../utilities/calculateWinningPlayer"

export const CHECK_WINNING_PLAYER = 'CHECK_WINNING_PLAYER'
export const SET_WINNING_PLAYER = 'SET_WINNING_PLAYER'

export const winningPlayerReducer = (winningPlayer = null, action) => {
  switch (action.type) {
    case CHECK_WINNING_PLAYER:
      return calculateWinningPlayer(action.winningScore, action.playerCollection)
    case SET_WINNING_PLAYER:
      return action.winningPlayer
    default:
      return winningPlayer
  }
}