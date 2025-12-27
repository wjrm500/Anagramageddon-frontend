import React from 'react'
import { useSelector } from 'react-redux'
import '../../css/ActionFeed.css'

const ActionFeed = () => {
  const actionFeed = useSelector(state => state.actionFeed)

  if (actionFeed.length === 0) {
    return null
  }

  return (
    <div id="actionFeed">
      <div className="feedContent">
        {actionFeed.map((entry, index) => (
          <div
            key={`${entry.playerName}-${entry.word}-${index}`}
            className="feedEntry"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="playerName" style={{ color: entry.playerColor }}>
              {entry.playerName}
            </span>
            {' played '}
            <span className="word">"{entry.word}"</span>
            {' for '}
            <span className="points">{entry.points} pts</span>
          </div>
        ))}
      </div>
      <div className="feedFade" />
    </div>
  )
}

export default ActionFeed
