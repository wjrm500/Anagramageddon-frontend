import React, { createContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { SET_BOXES } from '../reducers/boxes';
import { SET_PLAYER_COLLECTION } from '../reducers/playerCollection';
import Game from './game/Game';
import Lobby from './setup/Lobby';

export const WebSocketContext = createContext(null);
export const GameIdContext = createContext(null);
export const ConnectionStatusContext = createContext('disconnected');

const WebSocketContainer = ({phase}) => {
  const navigate = useNavigate()
  const {gameId} = useParams()
  const ws = useRef(null);
  const dispatch = useDispatch()
  const [gameOpen, setGameOpen] = useState(null)
  const [webSocketOpen, setWebSocketOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const playerIndexRef = useRef(null)
  const intentionalCloseRef = useRef(false)
  const reconnectTimeoutRef = useRef(null)

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
    },
    "playerAdded": (data) => {
      // Store playerIndex for reconnection
      playerIndexRef.current = data.playerIndex
    },
    "gameNotFound": () => {
      intentionalCloseRef.current = true
      ws.current?.close()
      alert("Game not found. It may have been deleted or the link is invalid.")
      navigate("/")
    },
    "rejoinFailed": (data) => {
      intentionalCloseRef.current = true
      ws.current?.close()
      alert(`Failed to rejoin game: ${data?.reason || 'Unknown error'}`)
      navigate("/")
    },
    "rejoinSuccessful": (data) => {
      // Rejoin was successful, state will be updated by other handlers
      console.log("Successfully rejoined game")
    }
  }

  const connect = () => {
    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    ws.current = new WebSocket(`${process.env.REACT_APP_API_WS_URL}`)

    ws.current.onopen = () => {
      setWebSocketOpen(true)
      setConnectionStatus('connected')
      setReconnectAttempts(0)

      // If we have a playerIndex, this is a reconnection - send REJOIN_GAME
      if (playerIndexRef.current !== null) {
        ws.current.send(JSON.stringify({
          type: "REJOIN_GAME",
          data: {gameId, playerIndex: playerIndexRef.current}
        }))
      } else {
        // Initial connection - send JOIN_GAME
        ws.current.send(JSON.stringify({type: "JOIN_GAME", data: {gameId}}))
      }
    }

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      const handler = wscMessageHandlers[data.type]
      if (handler) {
        handler(data.data)
      } else {
        console.warn(`Unhandled message type: ${data.type}`)
      }
    }

    ws.current.onclose = () => {
      setWebSocketOpen(false)

      // Check if this was an intentional close
      if (intentionalCloseRef.current) {
        setConnectionStatus('disconnected')
        navigate("/")
        return
      }

      // Unintentional close - attempt reconnection
      if (reconnectAttempts >= 5) {
        // Max reconnection attempts reached
        setConnectionStatus('disconnected')
        alert("Unable to reconnect to the game. Please try joining again.")
        navigate("/")
        return
      }

      // Set status to reconnecting
      setConnectionStatus('reconnecting')

      // Calculate exponential backoff delay (capped at 30 seconds)
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)

      // Schedule reconnection
      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectAttempts(prev => prev + 1)
        connect()
      }, delay)
    }
  }

  useEffect(() => {
    connect()

    window.onbeforeunload = () => {
      intentionalCloseRef.current = true
      ws.current?.close()
    }

    return () => {
      // Cleanup on unmount
      intentionalCloseRef.current = true
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      ws.current?.close()
    }
  }, [])

  return (
    <WebSocketContext.Provider value={ws}>
      <GameIdContext.Provider value={gameId}>
        <ConnectionStatusContext.Provider value={connectionStatus}>
          <div>
            {
              phase == Lobby
              ? <Lobby wscMessageHandlers={wscMessageHandlers} webSocketOpen={webSocketOpen} gameOpen={gameOpen} />
              : <Game webSocketOpen={webSocketOpen} gameOpen={gameOpen} />
            }
          </div>
        </ConnectionStatusContext.Provider>
      </GameIdContext.Provider>
    </WebSocketContext.Provider>
  )
}

export default WebSocketContainer