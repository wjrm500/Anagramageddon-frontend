import React from 'react'
import Header from '../Header'
import '../../css/Help.css'

const Help = () => {
  return (
    <div id="container">
      <Header />
      <div className="helpContent">
        <section className="helpSection">
          <h2 className="helpTitle">How to Play</h2>
          <p className="helpText">
            Players take turns to <strong>(A)</strong> select a letter from the grid, and <strong>(B)</strong> enter a word using their letters.
            Each letter claimed must be adjacent to one you already own. Words must be valid English dictionary words
            that can be formed from your letters. Score one point per letter in each word you enter.
          </p>
        </section>

        <section className="helpSection">
          <h2 className="helpTitle">Rules</h2>
          <ul className="helpList">
            <li>
              <span className="helpIcon">⚔️</span>
              <span>You can steal letters from opponents</span>
            </li>
            <li>
              <span className="helpIcon">🚫</span>
              <span>You cannot enter the same word twice</span>
            </li>
            <li>
              <span className="helpIcon">⏱️</span>
              <span>Wrong words incur a 5-second penalty</span>
            </li>
            <li>
              <span className="helpIcon">🏆</span>
              <span>If you reach the winning score but an opponent has a turn pending with enough letters to tie or beat you, they get to play first</span>
            </li>
          </ul>
        </section>

        <section className="helpSection">
          <h2 className="helpTitle">Volatile Boxes</h2>
          <p className="helpText">
            When enabled, some claimed boxes become "volatile" (shown shaking). These can be stolen back by opponents,
            adding an extra layer of strategy to the game.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Help
