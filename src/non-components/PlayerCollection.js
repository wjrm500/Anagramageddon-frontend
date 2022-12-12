class PlayerCollection {
  static playerColors = ["red", "blue", "green", "gold"]

  static maxPlayers = 4

  constructor() {
    this.players = []
    this.activeIndex = 0
  }

  getPlayerByIdx(idx) {
    return this.players[idx]
  }

  numPlayers() {
    return this.players.length
  }

  playerLimitReached() {
    return this.players.length >= this.maxPlayers
  }

  getPlayers() {
    return this.players
  }

  addPlayer(player) {
    this.players.push(player)
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

exports.PlayerCollection = PlayerCollection