import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DECREMENT_COUNTDOWN } from '../../reducers/countdownSeconds'
import { ACTION_CLICK_BOX, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import switchActivePlayerThunk from '../../thunks/switchActivePlayerThunk'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'

const Countdown = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const countdownSeconds = useSelector(state => state.countdownSeconds)
  const dispatch = useDispatch()
  useEffect(() => {
    const interval = setInterval(() => {
      if (countdownSeconds.current > 0) {
        dispatch({type: DECREMENT_COUNTDOWN})
      } else {
        dispatch(switchActivePlayerThunk(ws.current, gameId))
        dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_CLICK_BOX})
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [countdownSeconds.current])
  return (
    <span id="countdown">
      {countdownSeconds.current}
    </span>
  )
}

export default Countdown