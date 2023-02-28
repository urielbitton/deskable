import React from 'react'
import './styles/Avatar.css'

export default function Avatar(props) {

  const { src, dimensions="50px", alt='avatar', title, 
    border, onClick, enableEditing, removeTitle, 
    className='', round=true } = props

  return (
    <div 
      className={`avatar-container ${className} ${round ? 'round' : ''}`}
      style={{width: dimensions, height: dimensions, minWidth: dimensions, border}}
      title={title}
      onClick={() => onClick && onClick()}
    >
      <img 
        src={src} 
        alt={alt} 
      />
      {
        enableEditing &&
        <div 
          className="avatar-remove-icon"
          title={removeTitle}
        >
          <i className="fal fa-times" />
        </div>
      }
    </div>
  )
}
