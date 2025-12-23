import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CHECK_WINNING_PLAYER } from '../../reducers/winningPlayer'
import Header from '../Header'
import { GameIdContext, WebSocketContext } from '../WebSocketContainer'
import Grid from './Grid'
import Instruction from './Instruction'
import LetterBank from './LetterBank'
import ScoreTable from './ScoreTable'
import TextFlash from './TextFlash'
import WinnerBanner from './WinnerBanner'
import WordEntry from './WordEntry'

const Game = ({webSocketOpen, gameOpen}) => {
  const winningScore = useSelector(state => state.winningScore)
  const playerCollection = useSelector(state => state.playerCollection)
  const dispatch = useDispatch()
  dispatch({type: CHECK_WINNING_PLAYER, winningScore: winningScore, playerCollection: playerCollection})
  const winningPlayer = useSelector(state => state.winningPlayer)

  const ws = useContext(WebSocketContext)
  const gameId = useContext(GameIdContext)
  const gameEndedSentRef = useRef(false)

  useEffect(() => {
    if (winningPlayer != null && !gameEndedSentRef.current && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({type: 'GAME_ENDED', data: {gameId}}))
      gameEndedSentRef.current = true
    }
  }, [winningPlayer, ws, gameId])
  return (
    <div id="container" className="game-view">
      <Header />
      {
        webSocketOpen && gameOpen != null
        ? (
          gameOpen ? (
            <div id="gameContainer">
              <TextFlash />
              {
                winningPlayer != null
                ? <WinnerBanner />
                : ""
              }
              <Instruction />
              <Grid />
              <LetterBank />
              <WordEntry />
              <ScoreTable />
            </div>
          )
          : "Too late! This game has already started."
        )
        : ""
      }
    </div>
  )
}

export default Game