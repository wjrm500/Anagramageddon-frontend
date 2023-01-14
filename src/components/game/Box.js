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
    return (
      <div className="outerBox">
        <div
          className={"innerBox " + (!this.state.active ? "inactive " : " ") + (this.state.box.volatile ? "shaking": "")}
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