import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CHECK_WINNING_PLAYER } from '../../reducers/winningPlayer'
import Header from '../Header'
import Grid from './Grid'
import Instruction from './Instruction'
import ScoreNotification from './ScoreNotification'
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
  return (
    <div id="container">
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
              <WordEntry />
              <ScoreTable />
              <ScoreNotification />
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