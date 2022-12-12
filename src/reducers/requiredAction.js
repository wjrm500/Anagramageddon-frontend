export const SET_REQUIRED_ACTION = 'SET_REQUIRED_ACTION'

export const ACTION_CLICK_BOX = "Click box"
export const ACTION_ENTER_WORD = "Enter word"

export const requiredActionReducer = (requiredAction = ACTION_CLICK_BOX, action) => {
  switch (action.type) {
    case SET_REQUIRED_ACTION:
      return action.requiredAction
    default:
      return requiredAction
  }
}