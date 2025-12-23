export class Box {
  constructor(props) {
    const {coords, letter, player, volatile} = props
    this.coords = {x: coords.x, y: coords.y}
    this.letter = letter
    this.player = player
    this.volatile = volatile
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
  }
}