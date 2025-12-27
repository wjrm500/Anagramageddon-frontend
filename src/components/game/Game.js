import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CLEAR_DISCONNECTED_PLAYERS } from '../../reducers/disconnectedPlayers'
import { SET_ENDED_BY_ABANDONMENT } from '../../reducers/endedByAbandonment'
import { CHECK_WINNING_PLAYER } from '../../reducers/winningPlayer'
import Header from '../Header'
import DebugDisconnectButtons from '../DebugDisconnectButtons'
import { CloseConnectionContext, GameIdContext, WebSocketContext } from '../WebSocketContainer'
import ActionFeed from './ActionFeed'
import Grid from './Grid'
import Instruction from './Instruction'
import LetterBank from './LetterBank'
import ScoreTable from './ScoreTable'
import TextFlash from './TextFlash'
import WordEntry from './WordEntry'

const Game = ({webSocketOpen, gameOpen}) => {
  const winningScore = useSelector(state => state.winningScore)
  const playerCollection = useSelector(state => state.playerCollection)
  const dispatch = useDispatch()
  const winningPlayer = useSelector(state => state.winningPlayer)
  const endedByAbandonment = useSelector(state => state.endedByAbandonment)

  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const closeConnection = useContext(CloseConnectionContext)
  const navigate = useNavigate()
  const gameEndedSentRef = useRef(false)

  // Check for winning player whenever score or playerCollection changes
  // Skip if winner already set (e.g., by abandonment) to avoid overwriting with null
  useEffect(() => {
    if (!winningPlayer) {
      dispatch({type: CHECK_WINNING_PLAYER, winningScore, playerCollection})
    }
  }, [winningScore, playerCollection, winningPlayer, dispatch])

  // Lock body scroll to prevent iOS Safari keyboard from shifting layout
  useEffect(() => {
    document.body.classList.add('game-active')
    return () => document.body.classList.remove('game-active')
  }, [])

  useEffect(() => {
    // Only handle normal game ending here - abandonment is handled by WebSocketContainer
    if (winningPlayer != null && !gameEndedSentRef.current && !endedByAbandonment && ws.current?.readyState === WebSocket.OPEN) {
      // Game ended normally (not by abandonment)
      dispatch({type: CLEAR_DISCONNECTED_PLAYERS})
      dispatch({type: SET_ENDED_BY_ABANDONMENT, endedByAbandonment: false})
      ws.current.send(JSON.stringify({type: 'GAME_ENDED', data: {gameId}}))
      gameEndedSentRef.current = true
      closeConnection(true) // Pass true to preserve state for end screen
      navigate('/end')
    }
  }, [winningPlayer, endedByAbandonment, ws, gameId, closeConnection, navigate, dispatch])
  // Show game if we have playerCollection (meaning we're a valid participant)
  // Show "Too late" only if gameOpen is explicitly false and we don't have playerCollection
  const hasJoinedGame = playerCollection && playerCollection.players && playerCollection.players.length > 0
  const showGame = webSocketOpen && hasJoinedGame
  const showTooLate = webSocketOpen && gameOpen === false && !hasJoinedGame

  return (
    <div id="container" className="game-view">
      <Header />
      {
        showGame ? (
          <div id="gameContainer">
            <TextFlash />
            <Instruction />
            <Grid />
            <LetterBank />
            <WordEntry />
            <ScoreTable />
            <ActionFeed />
            <DebugDisconnectButtons />
          </div>
        ) : showTooLate ? (
          "Too late! This game has already started."
        ) : (
          "" // Loading state while connecting
        )
      }
    </div>
  )
}

export default Game