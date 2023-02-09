import React from 'react'
import './styles/AppPortal.css'
import AppPortal from "./AppPortal"

export default function AppTooltip({top, left, message, isOpen, onClose}) {
  
  if (!isOpen) return null

  return (
    <AppPortal
      showPortal={isOpen}
    >
      <div 
        className="app-tooltip"
        style={{top, left}}
      >
        <span>{message}</span>
        <button onClick={onClose}>Close</button>
      </div>
    </AppPortal>
  ) 
}