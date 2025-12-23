import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerCollection } from '../../non-components/PlayerCollection';
import { SET_BOXES } from '../../reducers/boxes';
import { INIT_COUNTDOWN } from '../../reducers/countdownSeconds';
import { SET_GRID_SIZE } from '../../reducers/gridSize';
import { SET_PLAYER_COLLECTION } from '../../reducers/playerCollection';
import { SET_PLAYER_INDEX } from '../../reducers/playerIndex';
import { ACTION_CLICK_BOX, SET_REQUIRED_ACTION } from '../../reducers/requiredAction';
import { FLASH_NEUTRAL, SET_TEXT_FLASH } from '../../reducers/textFlash';
import { SET_WINNING_SCORE } from '../../reducers/winningScore';
import Header from '../Header';
import { WebSocketContext } from '../WebSocketContainer';

const Lobby = ({wscMessageHandlers, webSocketOpen, gameOpen}) => {
  const navigate = useNavigate()
  const ws = useContext(WebSocketContext)
  const {gameId} = useParams()
  const [playerName, setPlayerName] = useState("")
  const [nameError, setNameError] = useState("")
  const playerNameSubmitted = useRef(false)
  const playerCollection = useSelector(state => state.playerCollection)
  const [playerLimitReached, setPlayerLimitReached] = useState(false)
  const dispatch = useDispatch()

  const lobbyMessageHandlers = {
    "connectionClosed": (data) => {
      alert("Connection closed unexpectedly by another client")
    },
    "playerAdded": (data) => {
      playerNameSubmitted.current = true
      const playerIndex = data.playerIndex
      dispatch({type: SET_PLAYER_INDEX, playerIndex})
    },
    "playerLimitReached": (data) => {
      setPlayerLimitReached(true)
    },
    "playerNameTaken": (data) => {
      setNameError("This name has already been taken")
    },
    "invalidPlayerName": (data) => {
      setNameError(data.message)
    },
    "startGame": (data) => {
      const {boxes, gridSize, winningScore, maxCountdownSeconds, playerCollection} = data
      dispatch({type: SET_BOXES, boxes})
      dispatch({type: SET_GRID_SIZE, gridSize})
      dispatch({type: SET_WINNING_SCORE, winningScore})
      dispatch({type: INIT_COUNTDOWN, maxCountdownSeconds})
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
      dispatch({type: SET_REQUIRED_ACTION, requiredAction: ACTION_CLICK_BOX})
      dispatch({type: SET_TEXT_FLASH, textFlash: {content: "", status: FLASH_NEUTRAL}})
      navigate(`/${gameId}/play`)
    }
  }

  useEffect(() => {
    if (ws.current == null) return
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      const combinedMessageHandlers = {...wscMessageHandlers, ...lobbyMessageHandlers}
      combinedMessageHandlers[data.type](data.data)
    }
  }, [ws.current])

  const inputDisabled = playerNameSubmitted.current || playerCollection.numPlayers() >= 4

  const validatePlayerName = (name) => {
    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      return "Name must be at least 2 characters"
    }
    if (trimmedName.length > 12) {
      return "Name must be no more than 12 characters"
    }
    return null
  }

  const onAddNameClick = () => {
    const error = validatePlayerName(playerName)
    if (error) {
      setNameError(error)
      return
    }
    setNameError("")
    ws.current.send(JSON.stringify({type: "ADD_PLAYER", data: {gameId, playerName: playerName.trim()}}))
  }

  const onStartGameClick = () => ws.current.send(JSON.stringify({type: "START_GAME", data: {gameId}}))

  const [showLinkCopied, setShowLinkCopied] = useState(false)

  const onCopyLinkClick = (evt) => {
    evt.preventDefault()
    navigator.clipboard.writeText(evt.target.getAttribute('href')).then(
      () => {
        setShowLinkCopied(true)
        setTimeout(() => {
          setShowLinkCopied(false)
        }, 50)
      }
    )
  }

  const form = <div id="lobbyComponent">
    <div id="linkComponent">
      <a href={window.location.href} style={{color: "blue", fontWeight: "bold", textDecoration: "none"}} onClick={onCopyLinkClick}>
        Click to copy lobby link
      </a>
      <span id="linkCopiedNotification" className={showLinkCopied ? "" : "alert-hidden"}>Link copied</span>
    </div>
    <div style={{width: "100%", marginBottom: "var(--space-lg)"}}>
      <div id="formComponent" style={{marginBottom: "0"}}>
        <input type="text" onChange={(e) => setPlayerName(e.target.value)} disabled={inputDisabled} onKeyDown={(e) => e.key == "Enter" ? onAddNameClick() : ""} placeholder="Enter name here" />
        <button onClick={onAddNameClick} disabled={inputDisabled}>
          Join
        </button>
      </div>
      {nameError && (
        <div style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #dc2626",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-sm) var(--space-md)",
          marginTop: "var(--space-sm)",
          color: "#dc2626",
          fontSize: "var(--font-size-sm)",
          fontWeight: "500"
        }}>
          {nameError}
        </div>
      )}
    </div>
    {
        playerCollection.numPlayers() > 0
        ? (
          <div id="playerListComponent">
            <div id="playerListTitle">
              Players in game:
            </div>
            <ul id="playerList">
              {
                playerCollection.getPlayerNames().map((name, idx) => {
                  const color = PlayerCollection.playerColors[idx]
                  return (
                    <li key={name} className="playerListItem" style={{color}}>
                      {name}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        )
        : ""
    }
    {
      playerNameSubmitted.current && playerCollection.numPlayers() >= 2
      ? <button id="startGameButton" onClick={onStartGameClick}>
        Start game
      </button>
      : ""
    }
  </div>

  return (
    <div id="container">
      <Header />
      {
        webSocketOpen && gameOpen != null
        ? (
          gameOpen ? (
            !playerLimitReached
            ? form
            : "Too late! The player limit has been reached."
          )
          : "Too late! This game has already started."
        )
        : ""
      }
    </div>    
  )
}

export default Lobby