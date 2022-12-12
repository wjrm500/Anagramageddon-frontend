export class Box {
  constructor(props) {
    const {coords, letter, player} = props
    this.coords = {x: coords.x, y: coords.y}
    this.letter = letter
    this.player = player ?? null
  }

  getX = () => this.coords.x

  getY = () => this.coords.y

  setPlayer = (player) => {
    if (this.player) {
      this.player.removeBox(this)
    }
    this.player = player
    player.addBox(this)
  }
}