export const SET_CLIENT_ACTIVE = 'SET_CLIENT_ACTIVE'

export const clientActiveReducer = (clientActive = false, action) => {
  switch (action.type) {
    case SET_CLIENT_ACTIVE:
      return action.clientActive
    default:
      return clientActive
  }
}