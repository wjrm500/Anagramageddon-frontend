import React, { useContext } from 'react'
import { CloseConnectionContext, WebSocketContext } from './WebSocketContainer'

const DebugDisconnectButtons = () => {
  const ws = useContext(WebSocketContext)
  const closeConnection = useContext(CloseConnectionContext)

  if (process.env.REACT_APP_SHOW_DEBUG !== 'true') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      zIndex: 9999
    }}>
      <button
        onClick={() => {
          ws.current?.close()
        }}
        style={{
          padding: '8px 12px',
          background: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Disconnect (auto-rejoin)
      </button>
      <button
        onClick={() => {
          closeConnection()
        }}
        style={{
          padding: '8px 12px',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Disconnect (permanent)
      </button>
    </div>
  )
}

export default DebugDisconnectButtons
