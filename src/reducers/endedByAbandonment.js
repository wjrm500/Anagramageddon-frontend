export const SET_ENDED_BY_ABANDONMENT = 'SET_ENDED_BY_ABANDONMENT'

export const endedByAbandonmentReducer = (endedByAbandonment = false, action) => {
  switch (action.type) {
    case SET_ENDED_BY_ABANDONMENT:
      return action.endedByAbandonment
    default:
      return endedByAbandonment
  }
}
