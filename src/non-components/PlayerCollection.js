export class PlayerCollection {
  // Vibrant colors that match the dark theme design system
  static playerColors = ["#ff6b6b", "#4ecdc4", "#a66cff", "#ffd93d"]

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

  getPlayerNames() {
    return this.players.map((player) => player.name)
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
    // Find next non-removed player
    let attempts = 0
    const numPlayers = this.players.length
    do {
      this.activeIndex = this.activeIndex == numPlayers - 1 ? 0 : this.activeIndex + 1
      attempts++
    } while (this.players[this.activeIndex].removed && attempts < numPlayers)
  }

  isActiveIndex(playerIndex) {
    return playerIndex == this.activeIndex
  }

  countActivePlayers() {
    return this.players.filter(player => !player.removed).length
  }
}