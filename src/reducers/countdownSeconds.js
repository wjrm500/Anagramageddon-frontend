// WebSocket actions
export const DECREMENT_COUNTDOWN = "DECREMENT_COUNTDOWN"
export const RESET_COUNTDOWN = "RESET_COUNTDOWN"

// Redux actions
export const SET_COUNTDOWN_SECONDS = "SET_COUNTDOWN_SECONDS"

export const countdownSecondsReducer = (countdownSeconds = null, action) => {
  switch (action.type) {
    case SET_COUNTDOWN_SECONDS:
      return action.countdownSeconds
    default:
      return countdownSeconds
  }
}