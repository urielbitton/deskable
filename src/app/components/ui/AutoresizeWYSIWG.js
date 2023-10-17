import React from 'react'
// import 'froala-editor/css/froala_style.min.css'
// import 'froala-editor/css/froala_editor.pkgd.min.css'
import FroalaEditorComponent from 'react-froala-wysiwyg'

export default function AutoresizeWYSIWG(props) {

  const { config } = props

  return (
    <FroalaEditorComponent
      tag='textarea'
      config={ config }
    />
  )
}
