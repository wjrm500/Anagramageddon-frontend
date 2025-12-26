export class Box {
  constructor(props) {
    const {coords, letter, player, volatile, locks} = props
    this.coords = {x: coords.x, y: coords.y}
    this.letter = letter
    this.player = player
    this.volatile = volatile
    this.locks = locks ?? 0
  }

  getX = () => this.coords.x

  getY = () => this.coords.y

  setPlayer = (player) => {
    const boxDatum = Object.values(this.coords)
    if (this.player) {
      this.player.boxData = this.player.boxData.filter(x => !(x[0] === boxDatum[0] && x[1] === boxDatum[1]))
    }
    this.player = player
    player.addBox(boxDatum)
    this.locks = 0
  }

  addLock = () => {
    if (this.locks < 3) {
      this.locks++
      return true
    }
    return false
  }

  removeLock = () => {
    if (this.locks > 0) {
      this.locks--
      return true
    }
    return false
  }
}