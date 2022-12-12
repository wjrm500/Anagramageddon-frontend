import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const Lobby = () => {
  const {gameId} = useParams()
  const [playerName, setPlayerName] = useState("")
  const [playerNames, setPlayerNames] = useState([])
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080")

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({type: "JOIN_GAME", data: gameId}))
    }

    ws.current.onmessage = (message) => {
      console.log(message)
      const data = JSON.parse(message.data)
      if (data.type === "playerNames") {
        setPlayerNames(data.data)
      }
    }

    return () => {
      ws.current.close()
    }
  }, [gameId])

  return (
    <div>
      <input type="text" onChange={(e) => setPlayerName(e.target.value)} />
      <button onClick={() => ws.current.send(JSON.stringify({type: "ADD_PLAYER", data: {gameId, playerName}}))}>Add name</button>
      {playerNames.map((name) => (
        <p key={name}>{name}</p>
      ))}
    </div>
  );
}

export default Lobby