import React, { createContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { SET_BOXES } from '../reducers/boxes';
import { SET_PLAYER_COLLECTION } from '../reducers/playerCollection';
import Game from './game/Game';
import Lobby from './setup/Lobby';

export const WebSocketContext = createContext(null);
export const GameIdContext = createContext(null);

const WebSocketContainer = ({phase}) => {
  const navigate = useNavigate()
  const {gameId} = useParams()
  const ws = useRef(null);
  const dispatch = useDispatch()
  const [gameOpen, setGameOpen] = useState(null)
  const [webSocketOpen, setWebSocketOpen] = useState(false)

  const wscMessageHandlers = {
    "setBoxes": (data) => {
      const boxes = data.boxes
      dispatch({type: SET_BOXES, boxes})
    },
    "setGameOpen": (data) => {
      setGameOpen(data.gameOpen)
    },
    "setPlayerCollection": (data) => {
      const playerCollection = data.playerCollection
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
    }
  }
  
  useEffect(() => {
    ws.current = new WebSocket(`${process.env.REACT_APP_API_WS_URL}`)

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
      navigate("/")
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