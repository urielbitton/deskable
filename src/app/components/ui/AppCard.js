import React from 'react'
import './styles/AppCard.css'

export default function AppCard(props) {

  const { children, padding='15px', className, onClick, withBorder,
    onDoubleClick, shadow } = props

  return (
    <div 
      className={`app-card ${shadow ? 'shadow' : ''} ${className ?? ''} ${withBorder ? 'withBorder' : ''}`}
      style={{ padding }}
      onClick={(e) => onClick && onClick(e)}
      onDoubleClick={(e) => onDoubleClick && onDoubleClick(e)}
    >
      {children}
    </div>
  )
}
