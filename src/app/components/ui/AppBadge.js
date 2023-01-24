import React from 'react'
import './styles/AppBadge.css'

export default function AppBadge(props) {

  const { label, icon='', light=true, fontSize='12px',
    onClick, blue } = props

  return (
    <div 
      className={`app-badge ${light ? 'light' : ''} ${onClick ? 'clickable' : ''} ${blue ? 'blue' : ''}`}
      onClick={(e) => onClick(e)}
    >
      { icon && <i className={icon} /> }
      <h6 style={{ fontSize }}>
        {label}
      </h6>
    </div>
  )
}
