import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate()
  const {gameId} = useParams()
  const [playerName, setPlayerName] = useState("")
  const playerNameSubmitted = useRef(false)
  const [playerNames, setPlayerNames] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [playerLimitReached, setPlayerLimitReached] = useState(false)
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080")

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({type: "JOIN_GAME", data: {gameId}}))
    }

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      switch (data.type) {
        case "playerNames":
          setPlayerNames(data.data.playerNames)
          if (data.data.playerNames.length == 4 && !playerNameSubmitted.current) {
            setPlayerLimitReached(true)
          }
          break
        case "startGame":
          if (playerNameSubmitted.current) {
            navigate(`/game/${gameId}/play`)
          } else {
            setGameStarted(true)
          }
          break
        case "playerLimitReached":
          setPlayerLimitReached(true)
          break
        case "gameAlreadyStarted":
          setGameStarted(true)
          break
      }
    }

    return () => {
      ws.current.close()
    }
  }, [gameId])

  const inputDisabled = playerNameSubmitted.current || playerNames.length == 4

  const onAddNameClick = () => {
    ws.current.send(JSON.stringify({type: "ADD_PLAYER", data: {gameId, playerName}}))
    playerNameSubmitted.current = true
  }

  const onStartGameClick = () => ws.current.send(JSON.stringify({type: "START_GAME", data: {gameId}}))

  const form = <div>
    <input type="text" onChange={(e) => setPlayerName(e.target.value)} disabled={inputDisabled} onKeyDown={(e) => e.key == "Enter" ? onAddNameClick() : ""} />
    <button onClick={onAddNameClick} disabled={inputDisabled}>
      Add name
    </button>
    {playerNames.map((name) => (
      <p key={name}>{name}</p>
    ))}
    {
      playerNames.length >= 2
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