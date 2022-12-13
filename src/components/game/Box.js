import React from 'react'

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      box: props.box,
      active: props.active,
      onClick: props.onClick
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      active: props.active
    })
  }

  render() {
    return (
      <div className="outerBox">
        <div
          className={"innerBox " + (!this.state.active ? "inactive" : "")}
          style={{
            backgroundColor: this.state.box.player ? this.state.box.player.color : "",
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