// Action types
export const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED'
export const PLAYER_RECONNECTED = 'PLAYER_RECONNECTED'
export const PLAYER_REMOVED = 'PLAYER_REMOVED'
export const SET_DISCONNECTED_PLAYERS = 'SET_DISCONNECTED_PLAYERS'
export const CLEAR_DISCONNECTED_PLAYERS = 'CLEAR_DISCONNECTED_PLAYERS'
export const UPDATE_GRACE_PERIOD = 'UPDATE_GRACE_PERIOD'

// State shape: { [playerIndex]: { playerName, remainingSeconds } }
const initialState = {}

export const disconnectedPlayersReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYER_DISCONNECTED:
      return {
        ...state,
        [action.playerIndex]: {
          playerName: action.playerName,
          remainingSeconds: action.gracePeriodSeconds
        }
      }
    case PLAYER_RECONNECTED:
    case PLAYER_REMOVED:
      const { [action.playerIndex]: removed, ...rest } = state
      return rest
    case SET_DISCONNECTED_PLAYERS:
      // Used when rejoining to sync state
      return action.disconnectedPlayers
    case CLEAR_DISCONNECTED_PLAYERS:
      return initialState
    case UPDATE_GRACE_PERIOD:
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
    default:
      return state
  }
}
