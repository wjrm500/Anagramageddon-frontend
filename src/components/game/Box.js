import React from 'react'

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      box: props.box,
      active: props.active,
      onClick: props.onClick,
      hovered: false
    }
    this.getColor = this.getColor.bind(this)
  }

  componentWillReceiveProps(props) {
    this.state = {
      box: props.box,
      active: props.active,
      onClick: props.onClick
    }
  }

  getColor() {
    const colorTuple = this.state.box.player.color
    const alpha = this.state.active ? 1 : 0.5
    return `rgba(${colorTuple[0]}, ${colorTuple[1]}, ${colorTuple[2]}, ${alpha})`
  }

  darkenColor(colorString, factor) { // Factor between 0 and 1 - a lower number gives a darker colour
    const colorValues = colorString.match(/\d+/g)
    const colorValuesAsNumbers = colorValues.map(value => parseInt(value))
    const newColor = `rgb(${colorValuesAsNumbers.map(x => parseInt(x * factor)).join(', ')})`
    return newColor
  }

  render() {
    const innerBoxClasses = ["innerBox"]
    if (!this.state.active) innerBoxClasses.push("inactive")
    if (this.state.box.volatile) innerBoxClasses.push("shaking")
    const standardBackgroundColor = "rgb(238, 238, 238)"
    let backgroundColor = this.state.box.player ? this.getColor() : standardBackgroundColor
    let cursor = "auto"
    if (!this.state.box.player && this.state.box.volatile) {
      backgroundColor = this.darkenColor(backgroundColor, 0.8)
    }
    if (!this.state.box.player && this.state.active && this.state.hovered) {
      backgroundColor = this.darkenColor(backgroundColor, 0.9)
      cursor = "pointer"
    }
    console.log(backgroundColor)
    return (
      <div className="outerBox">
        <div
          className={innerBoxClasses.join(" ")}
          style={{
            backgroundColor: backgroundColor,
            color: this.state.box.player ? "white" : "",
            cursor: cursor
          }}
          onClick={this.state.onClick}
          onMouseEnter={() => {
            this.state.hovered = true
            this.forceUpdate()
          }}
          onMouseLeave={() => {
            this.state.hovered = false
            this.forceUpdate()
          }}
          >
          {this.state.box.letter}
        </div>
      </div>
    )
  }
}

export default Box