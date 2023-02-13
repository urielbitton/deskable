import React from 'react'
import { DefaultEditor } from "react-simple-wysiwyg"
import AppButton from "./AppButton"

export default function WysiwygEditor(props) {

  const { html, setHtml, placeholder, className='', ref, height="200px", 
  styles, containerStyles, enableEditing, onSave, onCancel } = props

  return (
    <div 
      className={`wysiwyg-container ${className}`}
      style={containerStyles}
    >
      <DefaultEditor
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder={placeholder}
        style={{ ...styles, height, fontSize: 14, padding: '15px 10px', overflowY: 'auto' }}
        className={className}
        contentEditableRef={ref}
      />
      {
        enableEditing && 
        <div 
          className="edit-btn-group"
          style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}
        >
          <AppButton
            label="Save"
            onClick={onSave}
          />
          <AppButton
            label="Cancel"
            onClick={onCancel}
            buttonType="invertedBtn"
          />
        </div>
      }
    </div>
  )
}
