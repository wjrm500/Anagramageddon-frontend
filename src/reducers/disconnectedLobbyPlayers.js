// Action types
export const LOBBY_PLAYER_DISCONNECTED = 'LOBBY_PLAYER_DISCONNECTED'
export const LOBBY_PLAYER_RECONNECTED = 'LOBBY_PLAYER_RECONNECTED'
export const LOBBY_PLAYER_REMOVED = 'LOBBY_PLAYER_REMOVED'
export const SET_DISCONNECTED_LOBBY_PLAYERS = 'SET_DISCONNECTED_LOBBY_PLAYERS'
export const CLEAR_DISCONNECTED_LOBBY_PLAYERS = 'CLEAR_DISCONNECTED_LOBBY_PLAYERS'
export const UPDATE_LOBBY_GRACE_PERIOD = 'UPDATE_LOBBY_GRACE_PERIOD'
export const SHIFT_LOBBY_PLAYER_INDICES = 'SHIFT_LOBBY_PLAYER_INDICES'

// State shape: { [playerIndex]: { playerName, remainingSeconds } }
const initialState = {}

export const disconnectedLobbyPlayersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOBBY_PLAYER_DISCONNECTED:
      return {
        ...state,
        [action.playerIndex]: {
          playerName: action.playerName,
          remainingSeconds: action.gracePeriodSeconds
        }
      }
    case LOBBY_PLAYER_RECONNECTED:
    case LOBBY_PLAYER_REMOVED: {
      const { [action.playerIndex]: removed, ...rest } = state
      return rest
    }
    case SET_DISCONNECTED_LOBBY_PLAYERS:
      // Used when rejoining to sync state
      return action.disconnectedLobbyPlayers
    case CLEAR_DISCONNECTED_LOBBY_PLAYERS:
      return initialState
    case UPDATE_LOBBY_GRACE_PERIOD:
      // Decrement remaining seconds for a specific player
      if (!state[action.playerIndex]) return state
      const newSeconds = state[action.playerIndex].remainingSeconds - 1
      if (newSeconds <= 0) {
        // Player will be removed, so remove from this state
        const { [action.playerIndex]: toRemove, ...remaining } = state
        return remaining
      }
      return {
        ...state,
        [action.playerIndex]: {
          ...state[action.playerIndex],
          remainingSeconds: newSeconds
        }
      }
    case SHIFT_LOBBY_PLAYER_INDICES: {
      // Shift all player indices down by 1 for players after the removed one
      const { removedPlayerIndex } = action
      const newState = {}
      Object.entries(state).forEach(([idx, info]) => {
        const numIdx = parseInt(idx)
        if (numIdx > removedPlayerIndex) {
          newState[numIdx - 1] = info
        } else if (numIdx < removedPlayerIndex) {
          newState[numIdx] = info
        }
        // Skip the removed player index
      })
      return newState
    }
    default:
      return state
  }
}
