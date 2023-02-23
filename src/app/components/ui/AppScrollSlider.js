import React, { useState } from 'react'
import IconContainer from "./IconContainer"
import './styles/AppScrollSlider.css'

export default function AppScrollSlider(props) {

  const { children, onPrevClick, onNextClick, innerRef,
    arrowsDimensions = 27, arrowsSize = 14, scrollAmount } = props
  const [showPrevArrow, setShowPrevArrow] = useState(false)
  const [showNextArrow, setShowNextArrow] = useState(false)

  const handleScroll = () => {
    setShowPrevArrow(innerRef.current.scrollLeft > 0)
    setShowNextArrow(innerRef.current.scrollLeft <= (innerRef.current.scrollWidth - innerRef.current.clientWidth) - 1)
  }

  const arrowStyles = (showArrow) => {
    return { 
      visibility: showArrow ? 'visible' : 'hidden',
      opacity: showArrow ? 1 : 0,
    }
  }

  return (
    <div className="scroll-slider-parent">
      <div
        className="scroll-slider-container"
        ref={innerRef}
        onScroll={handleScroll}
      >
        <div className="scroll-flex">
          <div className="children">
            {children}
          </div>
        </div>
      </div> 
      <div className="scroll-arrows">
        <IconContainer
          icon="fas fa-arrow-left"
          iconSize={arrowsSize}
          iconColor="var(--darkGrayText)"
          bgColor="#fff"
          dimensions={arrowsDimensions}
          style={arrowStyles(showPrevArrow)}
          onClick={() => {
            innerRef.current.scrollTo({ left: innerRef.current.scrollLeft - scrollAmount, behavior: 'smooth' })
            onPrevClick && onPrevClick()
          }}
          className="left-arrow"
        />
        <IconContainer
          icon="fas fa-arrow-right"
          iconSize={arrowsSize}
          iconColor="var(--darkGrayText)"
          bgColor="#fff"
          dimensions={arrowsDimensions}
          style={arrowStyles(showNextArrow)}
          onClick={() => {
            innerRef.current.scrollTo({ left: innerRef.current.scrollLeft + scrollAmount, behavior: 'smooth' })
            onNextClick && onNextClick()
          }}
          className="right-arrow"
        />
      </div>
    </div>
  )
}
