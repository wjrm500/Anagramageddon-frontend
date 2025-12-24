import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ACTION_ENTER_WORD } from '../../reducers/requiredAction'

const parseColor = (color) => {
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return [r, g, b]
    }
    const match = color.match(/\(([^)]+)\)/)
    if (match) {
      return match[1].split(',').map(x => parseInt(x.trim()))
    }
  }
  return color
}

const LetterBank = () => {
  const playerIndex = useSelector(state => state.playerIndex)
  const playerCollection = useSelector(state => state.playerCollection)
  const requiredAction = useSelector(state => state.requiredAction)
  const winningPlayer = useSelector(state => state.winningPlayer)
  const boxes = useSelector(state => state.boxes)
  const wordInput = useSelector(state => state.wordInput)

  const playerActive = playerCollection.isActiveIndex(playerIndex)
  const currentPlayer = playerCollection.players[playerIndex]
  const active = playerActive && requiredAction === ACTION_ENTER_WORD && winningPlayer == null

  const letters = useMemo(() => {
    if (!currentPlayer || !boxes) return []
    return currentPlayer.boxData.map(([x, y]) => {
      const box = boxes[x]?.[y]
      return box ? box.letter : null
    }).filter(Boolean)
  }, [currentPlayer, boxes])

  // Compute which letter indices are "used" by the current input
  const usedIndices = useMemo(() => {
    if (!wordInput || !letters.length) return new Set()
    const used = new Set()
    const typedLetters = wordInput.split('')
    const availableIndices = letters.map((_, i) => i)

    for (const typedLetter of typedLetters) {
      // Find the first available letter that matches
      const matchIndex = availableIndices.find(
        i => !used.has(i) && letters[i] === typedLetter
      )
      if (matchIndex !== undefined) {
        used.add(matchIndex)
      }
    }
    return used
  }, [wordInput, letters])

  const backgroundColor = useMemo(() => {
    if (!currentPlayer) return ''
    const color = currentPlayer.color
    const [r, g, b] = parseColor(color)
    const alpha = active ? 1 : 0.5
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }, [currentPlayer, active])

  if (letters.length === 0) {
    return null
  }

  return (
    <div id="letterBank" className={active ? "active" : "inactive"}>
      <div className="letterBankTiles">
        {letters.map((letter, index) => (
          <div
            key={index}
            className={`letterBankTile${usedIndices.has(index) ? ' used' : ''}`}
            style={{ backgroundColor }}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LetterBank
