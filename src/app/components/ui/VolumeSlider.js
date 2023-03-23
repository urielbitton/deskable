import React, { useState } from 'react'
import './styles/VolumeSlider.css'

export default function VolumeSlider({value}) {

  const [sliderValue, setSliderValue] = useState(value)
  console.log(sliderValue)

  return (
    <div className="volume-slider">
      <input
        type={"range"}
        min={0}
        max={100}
        value={sliderValue}
        onChange={(e) => setSliderValue(e.target.value)}
      />
      <div 
        className="slider-min"
        style={{ width: `${sliderValue}%` }}
      />
    </div>
  )
}
