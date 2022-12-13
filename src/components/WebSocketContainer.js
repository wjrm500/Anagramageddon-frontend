import React, { createContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { SET_BOXES } from '../reducers/boxes';
import { SET_CLIENT_ACTIVE } from '../reducers/clientActive';
import { SET_COUNTDOWN_SECONDS } from '../reducers/countdownSeconds';
import { SET_PLAYER_COLLECTION } from '../reducers/playerCollection';
import Game from './game/Game';
import Lobby from './setup/Lobby';

export const WebSocketContext = createContext(null);
export const GameIdContext = createContext(null);

const WebSocketContainer = ({phase}) => {
  const {gameId} = useParams()
  const ws = useRef(null);
  const dispatch = useDispatch()
  const [gameOpen, setGameOpen] = useState(null)
  const [webSocketOpen, setWebSocketOpen] = useState(false)

  const wscMessageHandlers = {
    "setClientActive": (data) => {
      const clientActive = data.clientActive
      dispatch({type: SET_CLIENT_ACTIVE, clientActive})
    },
    "setCountdownSeconds": (data) => {
      const countdownSeconds = data.countdownSeconds
      dispatch({type: SET_COUNTDOWN_SECONDS, countdownSeconds})
    },
    "setPlayerCollection": (data) => {
      const playerCollection = data.playerCollection
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
    },
    "setBoxes": (data) => {
      const boxes = data.boxes
      dispatch({type: SET_BOXES, boxes})
    },
    "setGameOpen": (data) => {
      setGameOpen(data.gameOpen)
    }
  }
  
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080")

    ws.current.onopen = () => {
      setWebSocketOpen(true)
      ws.current.send(JSON.stringify({type: "JOIN_GAME", data: {gameId}}))
    }

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      wscMessageHandlers[data.type](data.data)
    }

    window.onbeforeunload = () => ws.current.close()

    ws.current.onclose = () => {
      setWebSocketOpen(false)
      console.log("WebSocket connection closed. Did another player refresh their browser or navigate to a different URL?")
    }
  }, [])

  return (
    <WebSocketContext.Provider value={ws}>
      <GameIdContext.Provider value={gameId}>
        <div>
          {
            phase == Lobby
            ? <Lobby wscMessageHandlers={wscMessageHandlers} webSocketOpen={webSocketOpen} gameOpen={gameOpen} />
            : <Game webSocketOpen={webSocketOpen} gameOpen={gameOpen} />
          }
        </div>
      </GameIdContext.Provider>
    </WebSocketContext.Provider>
  )
}

export default WebSocketContainer