import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { WebSocketContext } from './WebSocketContainer'

const Header = () => {
  const ws = useContext(WebSocketContext)
  const navigate = useNavigate()
  const onClick = () => {
    ws.current.close()
    navigate("/")
  }
  return (
    <h1 id="headerText" onClick={onClick}>
      ANAGRAMAGEDDON
    </h1>
  )
}

export default Header