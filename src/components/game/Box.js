import React from 'react'

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      box: props.box,
      active: props.active,
      onClick: props.onClick
    }
    this.getColor = this.getColor.bind(this)
  }

  componentWillReceiveProps(props) {
    this.state = {
      box: props.box,
      active: props.active,
      onClick: props.onClick,
    }
  }

  darkenColor(colorString, factor) { // Factor between 0 and 1 - a lower number gives a darker colour
    const colorValues = colorString.match(/\(([^)]+)\)/)[1].split(",").map(x => x.trim())
    if (colorValues.length == 3) {
      return `rgb(${colorValues.map(x => parseInt(x * factor)).join(', ')})`
    } else if (colorValues.length == 4) {
      const rgbValues = colorValues.slice(0, 3)
      const alpha = colorValues[3]
      return `rgba(${rgbValues.map(x => parseInt(x * factor)).join(', ')}, ${alpha})`
    }
  }

  getColor() {
    const colorTuple = this.state.box.player.color
    const alpha = this.state.active ? 1 : 0.5
    const colorString = `rgba(${colorTuple[0]}, ${colorTuple[1]}, ${colorTuple[2]}, ${alpha})`
    return this.state.box.volatile ? this.darkenColor(colorString, 0.8) : colorString
  }

  render() {
    const innerBoxClasses = ["innerBox"]
    if (this.state.box.player) innerBoxClasses.push("playerBox")
    if (!this.state.active) innerBoxClasses.push("inactive")
    if (this.state.box.volatile) innerBoxClasses.push("shaking")
    return (
      <div className="outerBox">
        <div
          className={innerBoxClasses.join(" ")}
          style={{
            backgroundColor: this.state.box.player ? this.getColor() : "",
            color: this.state.box.player ? "white" : ""
          }}
          onClick={this.state.onClick}
          >
          {this.state.box.letter}
        </div>
      </div>
    )
  }
}

export default Box