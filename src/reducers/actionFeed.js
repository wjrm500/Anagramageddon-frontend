// Redux actions
export const ADD_ACTION_FEED_ENTRY = 'ADD_ACTION_FEED_ENTRY'
export const CLEAR_ACTION_FEED = 'CLEAR_ACTION_FEED'

const initialState = []

export const actionFeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACTION_FEED_ENTRY:
      // Add new entry at the beginning (newest first)
      return [action.entry, ...state]
    case CLEAR_ACTION_FEED:
      return []
    default:
      return state
  }
}
