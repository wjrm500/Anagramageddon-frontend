import React, { createContext, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { SET_COUNTDOWN_SECONDS } from '../reducers/countdownSeconds';
import { SET_PLAYER_COLLECTION } from '../reducers/playerCollection';
import { SET_REQUIRED_ACTION } from '../reducers/requiredAction';
import Game from './game/Game';
import Lobby from './setup/Lobby';

export const WebSocketContext = createContext(null);
export const GameIdContext = createContext(null);

const WebSocketContainer = ({phase}) => {
  const {gameId} = useParams()
  const ws = useRef(null);
  const dispatch = useDispatch()
  
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080")

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({type: "JOIN_GAME", data: {gameId}}))
    }

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      switch (data.type) {
        case "setCountdownSeconds":
          const countdownSeconds = data.data.countdownSeconds
          debugger
          dispatch({type: SET_COUNTDOWN_SECONDS, countdownSeconds})
          break
        case "setRequiredAction":
          const requiredAction = data.data.requiredAction
          dispatch({type: SET_REQUIRED_ACTION, requiredAction})
          break
        case "setPlayerCollection":
          const playerCollection = data.data.playerCollection
          dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
          break
      }
    }
  }, [gameId])

  return (
    <WebSocketContext.Provider value={ws}>
      <GameIdContext.Provider value={gameId}>
        <div>
          {
            phase == Lobby
            ? <Lobby ws={ws} />
            : <Game ws={ws} />
          }
        </div>
      </GameIdContext.Provider>
    </WebSocketContext.Provider>
    
  )
}

export default WebSocketContainer