import React from 'react'
import './styles/AppBadge.css'

export default function AppBadge(props) {

  const { label, icon='', light=true, fontSize='12px',
    onClick, color, bgColor } = props

  return (
    <div 
      className={`app-badge ${light ? 'light' : ''} ${onClick ? 'clickable' : ''}`}
      style={{ color, background: bgColor }}
      onClick={(e) => onClick(e)}
    >
      { icon && <i className={icon} color={color} /> }
      <h6 style={{ fontSize }}>
        {label}
      </h6>
    </div>
  )
}
