import React from 'react'
import { useParams } from 'react-router-dom'

const Lobby = () => {
  const {gameId} = useParams()
  return (
    <div>Lobby {gameId}</div>
  )
}

export default Lobby