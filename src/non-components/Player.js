export class Player {
  constructor(props) {
    const {name, color, score, boxData, wordsUsed, turnsTaken, removed} = props
    this.name = name
    this.color = color
    this.score = score ?? 0
    this.boxData = boxData ?? []
    this.wordsUsed = wordsUsed ?? []
    this.turnsTaken = turnsTaken ?? 0
    this.removed = removed ?? false
  }

  getColor() {
    // Handle both hex strings and RGB tuples for backwards compatibility
    if (typeof this.color === 'string') {
      return this.color
    }
    const tup = this.color
    return `rgb(${tup[0]}, ${tup[1]}, ${tup[2]})`
  }

  addBox(boxDatum) {
    this.boxData.push(boxDatum)
  }

  canAddBox(box) {
    // Allow clicking own box to add locks (if not at max)
    if (box.player && box.player.name == this.name) {
      return box.locks < 3
    }
    for (let boxDatum of this.boxData) {
      if (Math.abs(boxDatum[0] - box.getX()) <= 1 && Math.abs(boxDatum[1] - box.getY()) <= 1) {
        return true
      }
    }
    return false
  }

  enterWord = (word) => {
    this.wordsUsed.push(word)
    this.score += word.length
  }
}
