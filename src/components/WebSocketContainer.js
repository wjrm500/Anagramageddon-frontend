import React, { createContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { ADD_ACTION_FEED_ENTRY } from '../reducers/actionFeed';
import { SET_BOXES } from '../reducers/boxes';
import { INIT_COUNTDOWN, RESET_COUNTDOWN } from '../reducers/countdownSeconds';
import { SET_CREATOR_PLAYER_INDEX } from '../reducers/creatorPlayerIndex';
import { CLEAR_DISCONNECTED_LOBBY_PLAYERS, LOBBY_PLAYER_DISCONNECTED, LOBBY_PLAYER_RECONNECTED, LOBBY_PLAYER_REMOVED, SET_DISCONNECTED_LOBBY_PLAYERS, SHIFT_LOBBY_PLAYER_INDICES } from '../reducers/disconnectedLobbyPlayers';
import { CLEAR_DISCONNECTED_PLAYERS, PLAYER_DISCONNECTED, PLAYER_RECONNECTED, PLAYER_REMOVED, SET_DISCONNECTED_PLAYERS } from '../reducers/disconnectedPlayers';
import { SET_ENDED_BY_ABANDONMENT } from '../reducers/endedByAbandonment';
import { SET_PLAYER_COLLECTION } from '../reducers/playerCollection';
import { SET_PLAYER_INDEX } from '../reducers/playerIndex';
import { SET_REQUIRED_ACTION } from '../reducers/requiredAction';
import { RESET_GAME_STATE } from '../reducers/rootReducer';
import { SET_WINNING_PLAYER } from '../reducers/winningPlayer';
import { Player } from '../non-components/Player';
import Game from './game/Game';
import Lobby from './setup/Lobby';

export const WebSocketContext = createContext(null);
export const GameIdContext = createContext(null);
export const ConnectionStatusContext = createContext('disconnected');
export const CloseConnectionContext = createContext(() => {});

// Helper to get/set playerIndex from sessionStorage (persists across page refresh)
const getStoredPlayerIndex = (gameId) => {
  const stored = sessionStorage.getItem(`playerIndex_${gameId}`)
  return stored !== null ? parseInt(stored, 10) : null
}

const setStoredPlayerIndex = (gameId, playerIndex) => {
  if (playerIndex !== null) {
    sessionStorage.setItem(`playerIndex_${gameId}`, playerIndex.toString())
  }
}

const clearStoredPlayerIndex = (gameId) => {
  sessionStorage.removeItem(`playerIndex_${gameId}`)
}

const WebSocketContainer = ({phase}) => {
  const navigate = useNavigate()
  const {gameId} = useParams()
  const ws = useRef(null);
  const dispatch = useDispatch()
  const [gameOpen, setGameOpen] = useState(null)
  const [webSocketOpen, setWebSocketOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  // Initialize playerIndexRef from sessionStorage to survive page refresh
  const storedIndex = getStoredPlayerIndex(gameId)
  const playerIndexRef = useRef(storedIndex)

  const intentionalCloseRef = useRef(false)
  const reconnectTimeoutRef = useRef(null)
  const navigatingToEndScreenRef = useRef(false)

  const wscMessageHandlers = {
    "setBoxes": (data) => {
      const boxes = data.boxes
      dispatch({type: SET_BOXES, boxes})
    },
    "setGameOpen": (data) => {
      // If game is closed (started) and we have a stored playerIndex but sent JOIN_GAME instead of REJOIN_GAME,
      // try to rejoin now. This handles edge cases where playerIndexRef wasn't populated correctly on mount.
      if (data.gameOpen === false && playerIndexRef.current === null) {
        const storedIdx = getStoredPlayerIndex(gameId)
        if (storedIdx !== null) {
          playerIndexRef.current = storedIdx
          ws.current?.send(JSON.stringify({
            type: "REJOIN_GAME",
            data: {gameId, playerIndex: storedIdx}
          }))
          return // Don't set gameOpen yet, wait for rejoinSuccessful
        }
      }
      setGameOpen(data.gameOpen)
    },
    "setPlayerCollection": (data) => {
      const playerCollection = data.playerCollection
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
      if (data.creatorPlayerIndex !== undefined) {
        dispatch({type: SET_CREATOR_PLAYER_INDEX, creatorPlayerIndex: data.creatorPlayerIndex})
      }
      // Reset countdown if it's now this player's turn
      if (playerIndexRef.current !== null && playerCollection.activeIndex === playerIndexRef.current) {
        dispatch({type: RESET_COUNTDOWN})
      }
    },
    "playerAdded": (data) => {
      playerIndexRef.current = data.playerIndex
      setStoredPlayerIndex(gameId, data.playerIndex)
    },
    "gameNotFound": () => {
      intentionalCloseRef.current = true
      ws.current?.close()
      clearStoredPlayerIndex(gameId)
      dispatch({type: RESET_GAME_STATE})
      alert("Game not found. It may have been deleted or the link is invalid.")
      navigate("/")
    },
    "rejoinFailed": (data) => {
      intentionalCloseRef.current = true
      ws.current?.close()
      clearStoredPlayerIndex(gameId)
      dispatch({type: RESET_GAME_STATE})
      alert(`Failed to rejoin game: ${data?.reason || 'Unknown error'}`)
      navigate("/")
    },
    "rejoinSuccessful": (data) => {
      if (data.creatorPlayerIndex !== undefined) {
        dispatch({type: SET_CREATOR_PLAYER_INDEX, creatorPlayerIndex: data.creatorPlayerIndex})
      }
      // Restore playerIndex from sessionStorage
      if (playerIndexRef.current !== null) {
        dispatch({type: SET_PLAYER_INDEX, playerIndex: playerIndexRef.current})
      }
      // Restore boxes and playerCollection BEFORE setting gameOpen
      // This ensures playerCollection is available when Game.js checks if user has joined
      if (data.boxes) {
        dispatch({type: SET_BOXES, boxes: data.boxes})
      }
      if (data.playerCollection) {
        dispatch({type: SET_PLAYER_COLLECTION, playerCollection: data.playerCollection})
      }
      // Initialize countdown if game has started (rejoin after page refresh)
      if (data.gameStarted && data.maxCountdownSeconds) {
        dispatch({type: INIT_COUNTDOWN, maxCountdownSeconds: data.maxCountdownSeconds})
      }
      // Sync disconnected players state on rejoin
      if (data.disconnectedPlayers) {
        const disconnectedState = {}
        for (const [idx, info] of Object.entries(data.disconnectedPlayers)) {
          disconnectedState[idx] = {
            playerName: info.playerName,
            remainingSeconds: info.remainingSeconds || 15 // Use server-provided remaining time
          }
        }
        dispatch({type: SET_DISCONNECTED_PLAYERS, disconnectedPlayers: disconnectedState})
      } else if (data.gameStarted) {
        // If rejoining a started game with no disconnected players, clear any stale state
        dispatch({type: CLEAR_DISCONNECTED_PLAYERS})
      }
      // Sync disconnected lobby players state on rejoin
      if (data.disconnectedLobbyPlayers) {
        const disconnectedLobbyState = {}
        for (const [idx, info] of Object.entries(data.disconnectedLobbyPlayers)) {
          disconnectedLobbyState[idx] = {
            playerName: info.playerName,
            remainingSeconds: info.remainingSeconds || 30
          }
        }
        dispatch({type: SET_DISCONNECTED_LOBBY_PLAYERS, disconnectedLobbyPlayers: disconnectedLobbyState})
      } else if (!data.gameStarted) {
        // If rejoining a lobby with no disconnected players, clear any stale state
        dispatch({type: CLEAR_DISCONNECTED_LOBBY_PLAYERS})
      }
      // Sync endedByAbandonment state
      if (data.endedByAbandonment !== undefined) {
        dispatch({type: SET_ENDED_BY_ABANDONMENT, endedByAbandonment: data.endedByAbandonment})
      }
      // Set gameOpen LAST - after playerCollection is set
      // This prevents a race condition where gameOpen=false triggers "Too late!" UI
      // before playerCollection is available
      if (data.gameStarted !== undefined) {
        setGameOpen(!data.gameStarted)
      }
    },
    "playerDisconnected": (data) => {
      const { playerIndex, playerName, gracePeriodSeconds } = data
      dispatch({type: PLAYER_DISCONNECTED, playerIndex, playerName, gracePeriodSeconds})
    },
    "playerReconnected": (data) => {
      const { playerIndex } = data
      dispatch({type: PLAYER_RECONNECTED, playerIndex})
    },
    "playerRemoved": (data) => {
      const { playerIndex, boxes, playerCollection } = data
      dispatch({type: PLAYER_REMOVED, playerIndex})
      dispatch({type: SET_BOXES, boxes})
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
    },
    "playerDisconnectedFromLobby": (data) => {
      const { playerIndex, playerName, gracePeriodSeconds } = data
      dispatch({type: LOBBY_PLAYER_DISCONNECTED, playerIndex, playerName, gracePeriodSeconds})
    },
    "playerReconnectedToLobby": (data) => {
      const { playerIndex } = data
      dispatch({type: LOBBY_PLAYER_RECONNECTED, playerIndex})
    },
    "playerRemovedFromLobby": (data) => {
      const { removedPlayerIndex, playerCollection, creatorPlayerIndex } = data
      dispatch({type: LOBBY_PLAYER_REMOVED, playerIndex: removedPlayerIndex})
      dispatch({type: SHIFT_LOBBY_PLAYER_INDICES, removedPlayerIndex})
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
      dispatch({type: SET_CREATOR_PLAYER_INDEX, creatorPlayerIndex})
    },
    "updatePlayerIndex": (data) => {
      const { playerIndex } = data
      playerIndexRef.current = playerIndex
      setStoredPlayerIndex(gameId, playerIndex)
      dispatch({type: SET_PLAYER_INDEX, playerIndex})
    },
    "gameEndedByAbandonment": (data) => {
      const { winnerPlayerIndex, playerCollection, boxes } = data

      navigatingToEndScreenRef.current = true
      intentionalCloseRef.current = true

      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
      dispatch({type: SET_BOXES, boxes})
      dispatch({type: SET_ENDED_BY_ABANDONMENT, endedByAbandonment: true})
      dispatch({type: CLEAR_DISCONNECTED_PLAYERS})

      if (typeof winnerPlayerIndex === 'number' && playerCollection && playerCollection.players) {
        const winnerData = playerCollection.players[winnerPlayerIndex]
        if (winnerData) {
          dispatch({type: SET_WINNING_PLAYER, winningPlayer: new Player(winnerData)})
        }
      }

      setTimeout(() => {
        navigate('/end')
        ws.current?.close()
        clearStoredPlayerIndex(gameId)
      }, 50)
    },
    "connectionClosed": () => {
      // Game was terminated by server
      intentionalCloseRef.current = true
      ws.current?.close()
      clearStoredPlayerIndex(gameId)
      dispatch({type: RESET_GAME_STATE})
    },
    "setRequiredAction": (data) => {
      const { requiredAction } = data
      // Map server action strings to frontend constants
      const actionMap = {
        'Click box': 'Click box',
        'Enter word': 'Enter word'
      }
      dispatch({type: SET_REQUIRED_ACTION, requiredAction: actionMap[requiredAction] || requiredAction})
    },
    "wordPlayed": (data) => {
      const { playerName, playerColor, word, points } = data
      dispatch({type: ADD_ACTION_FEED_ENTRY, entry: { playerName, playerColor, word, points }})
    }
  }

  const closeConnection = (navigatingToEndScreen = false) => {
    if (navigatingToEndScreen) {
      navigatingToEndScreenRef.current = true
    }
    intentionalCloseRef.current = true
    ws.current?.close()
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
      }
    }

    ws.current.onclose = () => {
      setWebSocketOpen(false)

      // Check if this was an intentional close
      if (intentionalCloseRef.current) {
        setConnectionStatus('disconnected')
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
      intentionalCloseRef.current = true
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      ws.current?.close()
      // Only reset Redux state if we're NOT navigating to the end screen
      // (end screen needs the game state to display results)
      if (!navigatingToEndScreenRef.current) {
        dispatch({type: RESET_GAME_STATE})
      }
    }
  }, [dispatch])

  return (
    <WebSocketContext.Provider value={ws}>
      <GameIdContext.Provider value={gameId}>
        <ConnectionStatusContext.Provider value={connectionStatus}>
          <CloseConnectionContext.Provider value={closeConnection}>
            <div>
              {
                phase === Lobby
                ? <Lobby wscMessageHandlers={wscMessageHandlers} webSocketOpen={webSocketOpen} gameOpen={gameOpen} />
                : <Game webSocketOpen={webSocketOpen} gameOpen={gameOpen} />
              }
            </div>
          </CloseConnectionContext.Provider>
        </ConnectionStatusContext.Provider>
      </GameIdContext.Provider>
    </WebSocketContext.Provider>
  )
}

export default WebSocketContainer