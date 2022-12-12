const INIT_TEXT_FLASH = {content: "", color: "black"}

export const SET_TEXT_FLASH = "SET_TEXT_FLASH"
export const FLASH_NEUTRAL = "black"
export const FLASH_SCORE = "green"
export const FLASH_ERROR = "red"

export const textFlashReducer = (textFlash = INIT_TEXT_FLASH, action) => {
  switch (action.type) {
    case SET_TEXT_FLASH:
      return action.textFlash
    default:
      return textFlash
  }
}