import { RESET_COUNTDOWN } from "../reducers/countdownSeconds"

const SWITCH_ACTIVE_PLAYER = 'SWITCH_ACTIVE_PLAYER'

const switchActivePlayerThunk = (ws, gameId) => {
  return (dispatch) => {
    // Don't dispatch SWITCH_ACTIVE_PLAYER locally - server will send correct activeIndex
    // This ensures disconnected players are properly skipped
    dispatch({type: RESET_COUNTDOWN})
    ws.send(JSON.stringify({type: SWITCH_ACTIVE_PLAYER, data: {gameId}}))
  }
}

export default switchActivePlayerThunk