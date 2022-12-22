import React from 'react'

const SpinningLoader = () => {
  const spinningLoader = require("../images/spinner-cropped.gif")
  return (
    <img id="spinningLoader" src={spinningLoader} height="12px" width="12px" />
  )
}

export default SpinningLoader