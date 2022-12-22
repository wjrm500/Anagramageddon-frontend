// Redux actions
export const APPLY_COUNTDOWN_PENALTY = "APPLY_COUNTDOWN_PENALTY"
export const DECREMENT_COUNTDOWN = "DECREMENT_COUNTDOWN"
export const INIT_COUNTDOWN = "INIT_COUNTDOWN"
export const RESET_COUNTDOWN = "RESET_COUNTDOWN"

const initCountdownSeconds = {
  current: 0,
  max: 0,
  penalty: 0
}

export const countdownSecondsReducer = (countdownSeconds = initCountdownSeconds, action) => {
  switch (action.type) {
    case APPLY_COUNTDOWN_PENALTY:
      return {
        ...countdownSeconds,
        current: countdownSeconds.current - countdownSeconds.penalty
      }
    case DECREMENT_COUNTDOWN:
      return {
        ...countdownSeconds,
        current: countdownSeconds.current - 1
      }
    case INIT_COUNTDOWN:
      return {
        ...countdownSeconds,
        current: action.maxCountdownSeconds,
        max: action.maxCountdownSeconds,
        penalty: Math.round(action.maxCountdownSeconds / 3)
      }
    case RESET_COUNTDOWN:
      return {
        ...countdownSeconds,
        current: countdownSeconds.max
      }
    default:
      return {
        ...countdownSeconds
      }
  }
}