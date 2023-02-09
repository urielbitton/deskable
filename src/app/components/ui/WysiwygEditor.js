import React from 'react'
import { DefaultEditor } from "react-simple-wysiwyg"

export default function WysiwygEditor({ html, setHtml, ...props }) {

  const { placeholder, className='', ref } = props

  return (
    <div className={`wysiwyg-container ${className}`}>
      <DefaultEditor
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder={placeholder}
        style={{ height: '200px', fontSize: 14, padding: '15px 10px', overflowY: 'auto' }}
        className={className}
        contentEditableRef={ref}
      />
    </div>
  )
}
