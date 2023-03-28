import React, { useState } from 'react'
import IconContainer from "./IconContainer"
import './styles/AppScrollSlider.css'

export default function AppScrollSlider(props) {

  const { children, onPrevClick, onNextClick, innerRef,
    arrowsDimensions = 27, arrowsSize = 14, scrollAmount,
    fadeEnd, hideScrollbar, hideArrows, className,
    orientation = 'horizonal' } = props
  const [showPrevArrow, setShowPrevArrow] = useState(false)
  const [showNextArrow, setShowNextArrow] = useState(false)
  const isVertical = orientation === 'vertical'

  const handleScroll = () => {
    if (!isVertical) {
      setShowPrevArrow(innerRef.current.scrollLeft > 0)
      setShowNextArrow(innerRef.current.scrollLeft <= (innerRef.current.scrollWidth - innerRef.current.clientWidth) - 1)
    }
    else {
      setShowPrevArrow(innerRef.current.scrollTop > 0)
      setShowNextArrow(innerRef.current.scrollTop <= (innerRef.current.scrollHeight - innerRef.current.clientHeight) - 1)
    }
  }

  const arrowStyles = (showArrow) => {
    return {
      visibility: showArrow ? 'visible' : 'hidden',
      opacity: showArrow ? 1 : 0,
    }
  }

  const onPrevArrowClick = () => {
    if(!isVertical) {
      innerRef.current.scrollTo({ left: innerRef.current.scrollLeft - scrollAmount, behavior: 'smooth' })
      onPrevClick && onPrevClick()
    }
    else {
      innerRef.current.scrollTo({ top: innerRef.current.scrollTop - scrollAmount, behavior: 'smooth' })
      onPrevClick && onPrevClick()
    }
  }

  const onNextArrowClick = () => {
    if(!isVertical) {
      innerRef.current.scrollTo({ left: innerRef.current.scrollLeft + scrollAmount, behavior: 'smooth' })
      onNextClick && onNextClick()
    }
    else {
      innerRef.current.scrollTo({ top: innerRef.current.scrollTop + scrollAmount, behavior: 'smooth' })
      onNextClick && onNextClick()
    }
  }

  return (
    <div className={`scroll-slider-parent ${className} ${orientation}`}>
      <div
        className={`scroll-slider-container ${hideScrollbar ? 'hide-scrollbar' : ''}`}
        ref={innerRef}
        onScroll={handleScroll}
      >
        <div className="scroll-flex">
          <div className="children">
            {children}
          </div>
        </div>
      </div>
      <div className={`scroll-arrows ${hideArrows ? 'hide-arrows' : ''}`}>
        <IconContainer
          icon={isVertical ? "fas fa-arrow-up" : "fas fa-arrow-left"}
          iconSize={arrowsSize}
          iconColor="var(--darkGrayText)"
          bgColor="#fff"
          dimensions={arrowsDimensions}
          style={arrowStyles(showPrevArrow)}
          onClick={onPrevArrowClick}
          className="left-arrow"
        />
        <IconContainer
          icon={isVertical ? "fas fa-arrow-down" : "fas fa-arrow-right"}
          iconSize={arrowsSize}
          iconColor="var(--darkGrayText)"
          bgColor="#fff"
          dimensions={arrowsDimensions}
          style={arrowStyles(showNextArrow)}
          onClick={onNextArrowClick}
          className="right-arrow"
        />
      </div>
      {fadeEnd && showNextArrow && <div className="faders" style={{ width: fadeEnd }} />}
    </div>
  )
}
