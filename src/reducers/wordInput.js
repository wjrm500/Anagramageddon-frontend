export const SET_WORD_INPUT = 'SET_WORD_INPUT'
export const CLEAR_WORD_INPUT = 'CLEAR_WORD_INPUT'

export const wordInputReducer = (state = '', action) => {
  switch (action.type) {
    case SET_WORD_INPUT:
      return action.value.toUpperCase()
    case CLEAR_WORD_INPUT:
      return ''
    case 'SWITCH_ACTIVE_PLAYER':
      return ''
    default:
      return state
  }
}
