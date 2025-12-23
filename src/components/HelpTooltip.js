import React, { useState, useRef, useEffect } from 'react'

const HelpTooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef(null)

  // Handle click outside to close tooltip on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isVisible])

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  return (
    <span className="help-tooltip-wrapper" ref={tooltipRef}>
      <span
        className="help-icon"
        onClick={handleClick}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        role="button"
        tabIndex={0}
        aria-label="Help information"
      >
        ?
      </span>
      {isVisible && (
        <span className="help-tooltip-content">
          {text}
        </span>
      )}
    </span>
  )
}

export default HelpTooltip
