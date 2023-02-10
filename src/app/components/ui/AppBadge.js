import React from 'react'
import './styles/AppBadge.css'

export default function AppBadge(props) {

  const { label, icon='', light=true, fontSize='12px',
    onClick, color, bgColor, iconSize } = props

  return (
    <div 
      className={`app-badge ${light ? 'light' : ''} ${onClick ? 'clickable' : ''}`}
      style={{ color, background: bgColor }}
      onClick={(e) => onClick && onClick(e)}
    >
      { 
        icon && 
        <i  
          className={icon} 
          style={{ color, fontSize: iconSize }} 
        /> 
      }
      <h6 style={{ fontSize, color }}>
        {label}
      </h6>
    </div>
  )
}
