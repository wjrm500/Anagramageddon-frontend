import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RESET_COUNTDOWN, SET_COUNTDOWN_SECONDS } from '../../reducers/countdownSeconds'
import { ENTER_WORD, SWITCH_ACTIVE_PLAYER } from '../../reducers/playerCollection'
import { ACTION_CLICK_BOX, ACTION_ENTER_WORD, SET_REQUIRED_ACTION } from '../../reducers/requiredAction'
import { FLASH_ERROR, FLASH_SCORE, SET_TEXT_FLASH } from '../../reducers/textFlash'
import { validateWord } from '../../utilities/validateWord'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'

const WordEntry = () => {
  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const countdownSeconds = useSelector(state => state.countdownSeconds)
  const requiredAction = useSelector(state => state.requiredAction)
  const clientActive = useSelector(state => state.clientActive)
  const active = clientActive && requiredAction == ACTION_ENTER_WORD
  const activePlayer = useSelector(state => state.playerCollection).getActivePlayer()
  const boxes = useSelector(state => state.boxes)
  const dispatch = useDispatch()
  const [value, setValue] = useState("")
  const onClick = () => {
    if (!active) {
      dispatch({type: SET_TEXT_FLASH, textFlash: {content: "Click a box", status: FLASH_ERROR}})
    }
  }
  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onKeyDown = (e) => {
    if (e.key == "Enter") {
      const word = e.target.value.toUpperCase()
      validateWord(word, activePlayer, boxes)
        .then(() => {
          dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_CLICK_BOX})
          dispatch({type: SET_TEXT_FLASH, textFlash: {content: "+" + word.length, status: FLASH_SCORE}})
          ws.current.send(JSON.stringify(({type: ENTER_WORD, data: {gameId, word}})))
          ws.current.send(JSON.stringify({type: RESET_COUNTDOWN, data: {gameId}}))
          ws.current.send(JSON.stringify({type: SWITCH_ACTIVE_PLAYER, data: {gameId}}))
        })
        .catch((error) => {
          dispatch({type: SET_TEXT_FLASH, textFlash: {content: error, status: FLASH_ERROR}})
          dispatch({type: SET_COUNTDOWN_SECONDS, countdownSeconds: countdownSeconds - 5})
        })
        .finally(() => setValue(""))
    }
  }
  return (
    <div id="wordEntryContainer" className={active ? "active" : "inactive"}>
        <div className="labelContainer">
            <label>Enter a word</label>
        </div>
        <div className="inputContainer" onClick={onClick}>
            <input ref={input => input && input.focus()} id="wordEntry" type="text" value={value} disabled={!active} autoComplete="off" onChange={onChange} onKeyDown={onKeyDown} />
        </div>
    </div>
  )
}

export default WordEntry