import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  return (
    <h1 id="headerText" onClick={() => navigate("/")}>
      ANAGRAMAGEDDON
    </h1>
  )
}

export default Header