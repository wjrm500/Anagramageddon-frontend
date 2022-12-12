import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate()
  const {gameId} = useParams()
  const [playerName, setPlayerName] = useState("")
  const [playerNameSubmitted, setPlayerNameSubmitted] = useState(false)
  const [playerNames, setPlayerNames] = useState([])
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
          console.log(data)
          setPlayerNames(data.data.playerNames)
          break
        case "startGame":
          navigate(`/game/${gameId}/play`)
          break
        case "playerLimitReached":
          alert("Player limit reached")
          break
        case "gameAlreadyStarted":
          alert("Game already started")
          break
      }
    }

    return () => {
      ws.current.close()
    }
  }, [gameId])

  const inputDisabled = playerNameSubmitted || playerNames.length == 4

  const onAddNameClick = () => {
    ws.current.send(JSON.stringify({type: "ADD_PLAYER", data: {gameId, playerName}}))
    setPlayerNameSubmitted(true)
  }

  const onStartGameClick = () => ws.current.send(JSON.stringify({type: "START_GAME", data: {gameId}}))

  return (
    <div>
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
  );
}

export default Lobby