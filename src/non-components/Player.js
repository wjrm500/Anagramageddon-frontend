export class Player {
  constructor(name, color) {
    this.name = name
    this.color = color
    this.score = 0
    this.boxes = []
    this.wordsUsed = []
    this.turnsTaken = 0
  }

  addBox(box) {
    this.boxes.push(box)
  }

  removeBox(box) {
    this.boxes = this.boxes.filter(x => x != box)
  }

  canAddBox(box) {
    if (this.boxes.includes(box)) {
      return false
    }
    for (let playerBox of this.boxes) {
      if (Math.abs(playerBox.getX() - box.getX()) <= 1 && Math.abs(playerBox.getY() - box.getY()) <= 1) {
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