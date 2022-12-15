import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RESET_COUNTDOWN, SET_COUNTDOWN_SECONDS } from '../../reducers/countdownSeconds'
import { SWITCH_ACTIVE_PLAYER } from '../../reducers/playerCollection'
import { ACTION_CLICK_BOX, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'

const Countdown = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const countdownSeconds = useSelector(state => state.countdownSeconds)
  const dispatch = useDispatch()
  useEffect(() => {
    const interval = setInterval(() => {
      if (countdownSeconds > 0) {
        dispatch({type: SET_COUNTDOWN_SECONDS, countdownSeconds: countdownSeconds - 1})
      } else {
        dispatch({type: SWITCH_ACTIVE_PLAYER})
        dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_CLICK_BOX})
        ws.current.send(JSON.stringify({type: RESET_COUNTDOWN, data: {gameId}}))
        ws.current.send(JSON.stringify({type: SWITCH_ACTIVE_PLAYER, data: {gameId}}))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [countdownSeconds])
  return (
    <span id="countdown">
      {countdownSeconds}
    </span>
  )
}

export default Countdown