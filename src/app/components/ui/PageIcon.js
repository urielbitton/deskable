import React from 'react'
import './styles/PageIcon.css'

export default function PageIcon(props) {

  const { dimensions=20, line1Width='75%', line2Width='88%', 
    line3Width='50%', gap=2, bgColor="var(--blue)" } = props

  return (
    <div 
      className="page-icon"
      style={{width: dimensions, height: dimensions, minWidth: dimensions, gap, background: bgColor}}
    >
      <hr style={{width: line1Width}} />
      <hr style={{width: line2Width}} />
      <hr style={{width: line3Width}} />
    </div>
  )
}
