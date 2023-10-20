import React from 'react'

export const ActionIcon = ({ icon, onClick, label = '', className = '' }) => {
  return (
    <div
      className={`action-icon ${className}`}
      onClick={onClick}
      title={label}
    >
      <i className={icon} />
    </div>
  )
}