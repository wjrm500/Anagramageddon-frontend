import React from 'react'
import Header from '../Header'
import '../../css/Help.css'

const Help = () => {
  return (
    <div id="container">
      <Header />
      <div id="helpContent">
        <h4>Summary</h4>
        <p>Players take it in turns to (A) select a letter from the grid, and (B) enter a word in the input box below the grid. Regarding (A), a letter can only be selected if it is adjacent to at least one letter already owned by the player. Regarding (B), it must be possible to form the entered word from the letters that the player owns, and the word must be a valid English word in the dictionary. Players score one point for each letter in every word that they enter, and the aim of the game is to reach a certain score before your opponent/s.</p>
        <h4>Notes</h4>
        <ul>
          <li>You can steal letters from their opponent</li>
          <li>You cannot enter the same word twice</li>
          <li>Entering an incorrect word (i.e., the word either doesn't exist, cannot be formed with your letters, or has already been used) incurs a five-second penalty</li>
          <li>If you reach the winning score before any of your opponents, but one of your opponents has a turn "in hand" and has enough letters to match or beat your score, the winner will only be decided once that opponent has also taken their turn. In the unlikely event that the opponent matches your score, turns will continue to be taken until one player ends the round on a higher score than the other</li>
        </ul>
      </div>
    </div>
  )
}

export default Help