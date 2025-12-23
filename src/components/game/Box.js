import React, { useMemo } from 'react'

// Helper to parse color (handles both hex and rgb tuple formats)
const parseColor = (color) => {
  if (typeof color === 'string') {
    // Hex color
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return [r, g, b]
    }
    // Already rgb/rgba string - extract values
    const match = color.match(/\(([^)]+)\)/)
    if (match) {
      return match[1].split(',').map(x => parseInt(x.trim()))
    }
  }
  // RGB tuple [r, g, b]
  return color
}

const Box = ({ box, active, onClick, isOpponent }) => {
  const getBackgroundColor = useMemo(() => {
    if (!box.player) return ''

    const color = box.player.color
    const [r, g, b] = parseColor(color)
    const alpha = active ? 1 : 0.5

    // Darken if volatile
    const factor = box.volatile ? 0.7 : 1
    const adjustedR = Math.round(r * factor)
    const adjustedG = Math.round(g * factor)
    const adjustedB = Math.round(b * factor)

    return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`
  }, [box.player, box.volatile, active])

  const innerBoxClasses = useMemo(() => {
    const classes = ['innerBox']
    if (box.player) classes.push('playerBox')
    if (!active) classes.push('inactive')
    if (box.volatile) classes.push('shaking')
    if (isOpponent) classes.push('opponentBox')
    return classes.join(' ')
  }, [box.player, box.volatile, active, isOpponent])

  return (
    <div className="outerBox">
      <div
        className={innerBoxClasses}
        style={{
          backgroundColor: getBackgroundColor,
          color: box.player ? 'white' : ''
        }}
        onClick={onClick}
      >
        {box.letter}
      </div>
    </div>
  )
}

export default Box
