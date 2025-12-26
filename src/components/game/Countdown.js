import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DECREMENT_COUNTDOWN } from '../../reducers/countdownSeconds'
import { ACTION_CLICK_BOX, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { SET_WORD_INPUT } from '../../reducers/wordInput'
import switchActivePlayerThunk from '../../thunks/switchActivePlayerThunk'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'

const Countdown = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const countdownSeconds = useSelector(state => state.countdownSeconds)
  const playerCollection = useSelector(state => state.playerCollection)
  const playerIndex = useSelector(state => state.playerIndex)
  const dispatch = useDispatch()

  // Track active player changes to ensure countdown runs only for the current active player's turn
  const isActivePlayer = playerCollection.isActiveIndex(playerIndex)
  const activePlayerIndex = playerCollection.getActiveIndex()

  useEffect(() => {
    // Only run countdown if this is the active player
    if (!isActivePlayer) {
      return
    }

    const interval = setInterval(() => {
      if (countdownSeconds.current > 0) {
        dispatch({type: DECREMENT_COUNTDOWN})
      } else {
        dispatch(switchActivePlayerThunk(ws.current, gameId))
        dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_CLICK_BOX})
        dispatch({type: SET_WORD_INPUT, value: ""})
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [countdownSeconds.current, isActivePlayer, activePlayerIndex, dispatch, ws, gameId])

  return (
    <span id="countdown">
      {countdownSeconds.current}
    </span>
  )
}

export default Countdown