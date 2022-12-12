import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FLASH_NEUTRAL, FLASH_SCORE, SET_TEXT_FLASH } from '../../reducers/textFlash'

const TextFlash = () => {
  const textFlash = useSelector(state => state.textFlash)
  const dispatch = useDispatch()
  const onAnimationEnd = () => dispatch({type: SET_TEXT_FLASH, textFlash: {content: "", status: FLASH_NEUTRAL}})
  let classNames = []
  if (textFlash.content.length > 0) {
    classNames.push("fontGrow")
  }
  if (textFlash.status == FLASH_SCORE) {
    classNames.push("flashScore")
  } else {
    classNames.push("notFlashScore")
  }
  return (
    <div
      id="textFlash"
      style={{color: textFlash.status}}
      className={classNames.join(" ")}
      onAnimationEnd={onAnimationEnd}
      >
      {textFlash.content}
    </div>
  )
}

export default TextFlash