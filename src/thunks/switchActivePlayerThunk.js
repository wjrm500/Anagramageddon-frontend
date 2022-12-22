import { RESET_COUNTDOWN } from "../reducers/countdownSeconds"
import { SWITCH_ACTIVE_PLAYER } from "../reducers/playerCollection"

const switchActivePlayerThunk = (ws, gameId) => {
  return (dispatch, getState) => {
    dispatch({type: SWITCH_ACTIVE_PLAYER})
    dispatch({type: RESET_COUNTDOWN})
    ws.send(JSON.stringify({type: SWITCH_ACTIVE_PLAYER, data: {gameId}}))
  }
}

export default switchActivePlayerThunk