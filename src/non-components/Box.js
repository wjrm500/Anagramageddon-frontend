export class Box {
  constructor(props) {
    const {coords, letter, player} = props
    this.coords = {x: coords.x, y: coords.y}
    this.letter = letter
    this.player = player
  }

  getX = () => this.coords.x

  getY = () => this.coords.y
}