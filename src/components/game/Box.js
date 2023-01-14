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
      onClick: props.onClick
    }
  }

  getColor() {
    const colorTuple = this.state.box.player.color
    const alpha = this.state.active ? 1 : 0.5
    return `rgba(${colorTuple[0]}, ${colorTuple[1]}, ${colorTuple[2]}, ${alpha})`
  }

  render() {
    const innerBoxClasses = ["innerBox"]
    if (!this.state.active) innerBoxClasses.push("inactive")
    if (this.state.box.volatile) innerBoxClasses.push("shaking")
    const standardBackgroundColor = "rgb(238, 238, 238)"
    let backgroundColor = this.state.box.player ? this.getColor() : standardBackgroundColor
    if (this.state.box.volatile) {
      const colorValues = backgroundColor.match(/\d+/g);
      const colorValuesAsNumbers = colorValues.map(value => parseInt(value));
      const multiplier = 0.8 // Between 0 and 1 - higher means volatile boxes will have a lighter colour relative to normal boxes
      const newColor = "rgb(" + (colorValuesAsNumbers[0] * multiplier) + "," + (colorValuesAsNumbers[1] * multiplier) + "," + (colorValuesAsNumbers[2] * multiplier) + ")"
      backgroundColor = newColor
    }
    return (
      <div className="outerBox">
        <div
          className={innerBoxClasses.join(" ")}
          style={{
            backgroundColor: backgroundColor,
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