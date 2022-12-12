export class PlayerCollection {
  constructor() {
    this.players = []
    this.activeIndex = 0
  }

  getPlayerByIdx(idx) {
    return this.players[idx]
  }

  getPlayers() {
    return this.players
  }

  addPlayers(players) {
    this.players = players
  }

  getActiveIndex() {
    return this.activeIndex
  }

  setActiveIndex(activeIndex) {
    this.activeIndex = activeIndex
  }

  getActivePlayer() {
    return this.players[this.activeIndex]
  }

  switchActivePlayer() {
    this.players[this.activeIndex].turnsTaken += 1
    this.activeIndex = this.activeIndex == this.players.length - 1 ? 0 : this.activeIndex + 1
  }
}