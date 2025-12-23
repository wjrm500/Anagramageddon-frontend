import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { APPLY_COUNTDOWN_PENALTY, RESET_COUNTDOWN } from '../../reducers/countdownSeconds'
import { ENTER_WORD } from '../../reducers/playerCollection'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { FLASH_ERROR, FLASH_SCORE, SET_TEXT_FLASH } from '../../reducers/textFlash'
import { validateWord } from '../../utilities/validateWord'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'

const WordEntry = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const requiredAction = useSelector(state => state.requiredAction)
  const playerIndex = useSelector(state => state.playerIndex)
  const playerCollection = useSelector(state => state.playerCollection)
  const playerActive = playerCollection.isActiveIndex(playerIndex)
  const active = playerActive && requiredAction == ACTION_ENTER_WORD
  const activePlayer = playerCollection.getActivePlayer()
  const activePlayerRef = useRef(activePlayer)
  useEffect(() => {
    activePlayerRef.current = activePlayer
  }, [activePlayer])
  const boxes = useSelector(state => state.boxes)
  const dispatch = useDispatch()
  const [value, setValue] = useState("")
  const onClick = () => {
    if (!playerActive) return
    if (requiredAction == ACTION_CLICK_BOX) {
      dispatch({type: SET_TEXT_FLASH, textFlash: {content: "Click a box", status: FLASH_ERROR}})
    }
  }
  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onKeyDown = (e) => {
    if (e.key == "Enter") {
      const word = e.target.value.toUpperCase()
      validateWord(word, activePlayerRef.current, boxes)
        .then(() => {
          if (activePlayer == activePlayerRef.current) { // Prevents issue whereby Countdown sends "Switch active player" event to server after keydown event but before this callback is run
            dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_CLICK_BOX})
            dispatch({type: SET_TEXT_FLASH, textFlash: {content: "+" + word.length, status: FLASH_SCORE}})
            // Dispatch locally to increases responsiveness
            dispatch({type: ENTER_WORD, word})
            dispatch({type: RESET_COUNTDOWN})
            ws.current.send(JSON.stringify(({type: ENTER_WORD, data: {gameId, word}})))
          } else {
            dispatch({type: SET_TEXT_FLASH, textFlash: {content: "Too late!", status: FLASH_ERROR}})
          }
        })
        .catch((error) => {
          dispatch({type: SET_TEXT_FLASH, textFlash: {content: error, status: FLASH_ERROR}})
          dispatch({type: APPLY_COUNTDOWN_PENALTY})
        })
        .finally(() => setValue(""))
    }
  }
  return (
    <div id="wordEntryContainer" className={active ? "active" : "inactive"} onClick={onClick}>
        <input
          ref={input => input && input.focus()}
          id="wordEntry"
          type="text"
          value={value}
          disabled={!active}
          autoComplete="off"
          placeholder="Enter a word..."
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
    </div>
  )
}

export default WordEntry