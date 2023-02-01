import React from 'react'
import './styles/Avatar.css'

export default function Avatar(props) {

  const { src, dimensions="50px", alt='avatar', title, 
    border, onClick } = props

  return (
    <div 
      className="avatar-container"
      style={{width: dimensions, height: dimensions, minWidth: dimensions, border}}
      title={title}
      onClick={() => onClick && onClick()}
    >
      <img 
        src={src} 
        alt={alt} 
      />
    </div>
  )
}
