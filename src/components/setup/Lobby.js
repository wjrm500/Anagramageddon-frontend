import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerCollection } from '../../non-components/PlayerCollection';
import { SET_BOXES } from '../../reducers/boxes';
import { INIT_COUNTDOWN } from '../../reducers/countdownSeconds';
import { SET_GRID_SIZE } from '../../reducers/gridSize';
import { SET_PLAYER_COLLECTION } from '../../reducers/playerCollection';
import { SET_PLAYER_INDEX } from '../../reducers/playerIndex';
import { SET_WINNING_SCORE } from '../../reducers/winningScore';
import Header from '../Header';
import { WebSocketContext } from '../WebSocketContainer';

const Lobby = ({wscMessageHandlers, webSocketOpen, gameOpen}) => {
  const navigate = useNavigate()
  const ws = useContext(WebSocketContext)
  const {gameId} = useParams()
  const [playerName, setPlayerName] = useState("")
  const playerNameSubmitted = useRef(false)
  const playerCollection = useSelector(state => state.playerCollection)
  const [playerLimitReached, setPlayerLimitReached] = useState(false)
  const dispatch = useDispatch()

  const lobbyMessageHandlers = {
    "playerAdded": (data) => {
      playerNameSubmitted.current = true
      const playerIndex = data.playerIndex
      dispatch({type: SET_PLAYER_INDEX, playerIndex})
    },
    "playerLimitReached": (data) => {
      setPlayerLimitReached(true)
    },
    "playerNameTaken": (data) => {
      alert("This name has already been taken")
    },
    "startGame": (data) => {
      const {boxes, gridSize, winningScore, maxCountdownSeconds, playerCollection} = data
      dispatch({type: SET_BOXES, boxes})
      dispatch({type: SET_GRID_SIZE, gridSize})
      dispatch({type: SET_WINNING_SCORE, winningScore})
      dispatch({type: INIT_COUNTDOWN, maxCountdownSeconds})
      dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
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

  const onAddNameClick = () => ws.current.send(JSON.stringify({type: "ADD_PLAYER", data: {gameId, playerName}}))

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
    <div id="formComponent">
      <input type="text" onChange={(e) => setPlayerName(e.target.value)} disabled={inputDisabled} onKeyDown={(e) => e.key == "Enter" ? onAddNameClick() : ""} placeholder="Enter name here" />
      <button onClick={onAddNameClick} disabled={inputDisabled}>
        Join
      </button>
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