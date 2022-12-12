import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SET_COUNTDOWN_SECONDS } from '../../reducers/countdownSeconds';
import { SET_GRID_SIZE } from '../../reducers/gridSize';
import { SET_PLAYER_COLLECTION } from '../../reducers/playerCollection';
import { SET_WINNING_SCORE } from '../../reducers/winningScore';

const Lobby = ({ws, wscMessageHandlers}) => {
  const navigate = useNavigate()
  const {gameId} = useParams()
  const [playerName, setPlayerName] = useState("")
  const playerNameSubmitted = useRef(false)
  const playerCollection = useSelector(state => state.playerCollection)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerLimitReached, setPlayerLimitReached] = useState(false)
  const dispatch = useDispatch()

  const lobbyMessageHandlers = {
    "startGame": (data) => {
      if (playerNameSubmitted.current) {
        const {gridSize, winningScore, maxCountdownSeconds, playerCollection} = data
        dispatch({type: SET_GRID_SIZE, gridSize})
        dispatch({type: SET_WINNING_SCORE, winningScore})
        dispatch({type: SET_COUNTDOWN_SECONDS, countdownSeconds: maxCountdownSeconds})
        dispatch({type: SET_PLAYER_COLLECTION, playerCollection})
        navigate(`/game/${gameId}/play`)
      } else {
        setGameStarted(true)
      }
    },
    "playerLimitReached": (data) => {
      setPlayerLimitReached(true)
    },
    "gameAlreadyStarted": (data) => {
      setGameStarted(true)
    },
    "playerAdded": (data) => {
      playerNameSubmitted.current = true
    },
    "playerNameTaken": (data) => {
      alert("This name has already been taken")
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

  const form = <div>
    <input type="text" onChange={(e) => setPlayerName(e.target.value)} disabled={inputDisabled} onKeyDown={(e) => e.key == "Enter" ? onAddNameClick() : ""} />
    <button onClick={onAddNameClick} disabled={inputDisabled}>
      Add name
    </button>
    {
      playerCollection.getPlayerNames().map((name) => (
        <p key={name}>{name}</p>
      ))
    }
    {
      playerNameSubmitted.current && playerCollection.numPlayers() >= 2
      ? <button onClick={onStartGameClick}>
        Start game
      </button>
      : ""
    }
  </div>

  return (
    <div>
      {
        !gameStarted
        ? (
          !playerLimitReached
          ? form
          : "Too late! The player limit has been reached."
        )
        : "Too late! This game has already started."
      }
    </div>    
  )
}

export default Lobby