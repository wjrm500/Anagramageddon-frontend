import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DECREMENT_COUNTDOWN, RESET_COUNTDOWN } from '../../reducers/countdownSeconds'
import { SWITCH_ACTIVE_PLAYER } from '../../reducers/playerCollection'
import { ACTION_CLICK_BOX, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'

const Countdown = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const countdownSeconds = useSelector(state => state.countdownSeconds.current)
  useEffect(() => {
    const interval = setInterval(() => {
      if (countdownSeconds > 0) {
        ws.send(JSON.stringify(({type: DECREMENT_COUNTDOWN, data: {gameId, decrementBy: 1}})))
      } else {
        ws.send(JSON.stringify({type: RESET_COUNTDOWN, data: {gameId}}))
        ws.send(JSON.stringify({type: SET_REQUIRED_ACTION, data: {requiredAction: ACTION_CLICK_BOX}}))
        ws.send(JSON.stringify({type: SWITCH_ACTIVE_PLAYER, data: {gameId}}))
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