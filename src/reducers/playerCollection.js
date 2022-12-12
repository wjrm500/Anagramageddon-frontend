import { Player } from "../non-components/Player"
import { PlayerCollection } from "../non-components/PlayerCollection"

export const playerColors = ["red", "blue", "green", "gold"]
export const ADD_PLAYERS = 'ADD_PLAYERS'
export const ENTER_WORD = 'ENTER_WORD'
export const SWITCH_ACTIVE_PLAYER = 'SWITCH_ACTIVE_PLAYERS'

const getNewPlayerCollection = (playerCollection) => { // Otherwise components won't re-render owing to reference equality check
  const players = playerCollection.getPlayers()
  const activeIndex = playerCollection.getActiveIndex()
  const newPlayerCollection = new PlayerCollection()
  newPlayerCollection.addPlayers(players)
  newPlayerCollection.setActiveIndex(activeIndex)
  return newPlayerCollection
}

export const playerCollectionReducer = (playerCollection = new PlayerCollection(), action) => {
  switch (action.type) {
    case ADD_PLAYERS:
      const players = action.value.map((playerName, idx) => new Player(playerName, playerColors[idx]))
      playerCollection.addPlayers(players)
      return getNewPlayerCollection(playerCollection)
    case ENTER_WORD:
      playerCollection.getActivePlayer().enterWord(action.value)
      return getNewPlayerCollection(playerCollection)
    case SWITCH_ACTIVE_PLAYER:
      playerCollection.switchActivePlayer()
      return getNewPlayerCollection(playerCollection)
    default:
      return playerCollection
}
}