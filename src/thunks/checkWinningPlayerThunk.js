import { CHECK_WINNING_PLAYER } from "../reducers/winningPlayer"

// Thunk to check for winning player using current Redux state
// Must be dispatched AFTER SET_PLAYER_COLLECTION so state is up to date
const checkWinningPlayerThunk = () => {
  return (dispatch, getState) => {
    const { winningScore, winningPlayer, playerCollection } = getState()
    // Only check if no winner already set
    if (!winningPlayer) {
      dispatch({type: CHECK_WINNING_PLAYER, winningScore, playerCollection})
    }
  }
}

export default checkWinningPlayerThunk
