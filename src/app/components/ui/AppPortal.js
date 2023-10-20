import React from 'react'
import './styles/AppPortal.css'
import { createPortal } from 'react-dom'

export default function AppPortal(props) {

  const { children, showPortal, className="app-portal",
    position } = props
  const { top='0px', left='0px' } = position || {}

  if (!showPortal) return null
  return createPortal(
    <div 
      className={className}
      style={{ position: 'absolute', top, left, zIndex: 1000}}
    >
      {children}
    </div>, 
    document.body
  )
}

