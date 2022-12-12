import { Player } from "../non-components/Player"
import { PlayerCollection } from "../non-components/PlayerCollection"

// WebSocket actions
export const ENTER_WORD = 'ENTER_WORD'
export const SWITCH_ACTIVE_PLAYER = 'SWITCH_ACTIVE_PLAYER'

// Redux actions
export const SET_PLAYER_COLLECTION = 'SET_PLAYER_COLLECTION'

const createPlayerCollection = (playerCollection) => { // Otherwise components won't re-render owing to reference equality check
  const players = playerCollection.players
  const activeIndex = playerCollection.activeIndex
  const newPlayerCollection = new PlayerCollection()
  for (const player of players) {
    newPlayerCollection.addPlayer(new Player(player))
  }
  newPlayerCollection.setActiveIndex(activeIndex)
  return newPlayerCollection
}

export const playerCollectionReducer = (playerCollection = new PlayerCollection(), action) => {
  switch (action.type) {
    case SET_PLAYER_COLLECTION:
      return createPlayerCollection(action.playerCollection)
    default:
      return playerCollection
  }
}