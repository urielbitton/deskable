import React from 'react'
import './styles/FileUploadBtn.css'

export default function FileUploadBtn(props) {

  const { accept, inputRef, label, iconRight, iconLeft,
    background, color, border, classic,
    onChange, className="" } = props

  return (
    <div 
      className={`${classic ? 'classic' : ''} ${className}`}
      style={{ background, color, border }}
    >
      <label>
        <input
          type="file"
          hidden
          multiple
          accept={accept}
          ref={inputRef}
          onChange={onChange}
        />
      </label>
      {iconLeft && <i className={iconLeft} />}
      <span>{label}</span>
      {iconRight && <i className={iconRight} />}
    </div>
  )
}
