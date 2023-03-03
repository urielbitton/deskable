import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const tinymceAPIKey = process.env.REACT_APP_TINYMCEKEY

export default function TinymceEditor(props) {

  const { editorRef, editorHeight=300, customBtnOnClick,
    customBtnLabel } = props

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  return (
    <Editor
      apiKey={tinymceAPIKey}
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue=""
      init={{
        height: editorHeight,
        placeholder: 'Start jotting down ideas here...or use the sidebar templates to get inspired quickly.',
        menubar: false,
        statusbar: false,
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        setup: (editor) => {
          customBtnLabel && editor.ui.registry.addButton('customBtn', {
            text: customBtnLabel,
            onAction: () => customBtnOnClick(),
          })
        },
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'fullscreen', 'emoticons',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'inlinecode',
          'codesample', 'template', 'fontSelect', 'fontsizeselect', 'mentions',
          'print'
        ],
        toolbar: 'customBtn undo redo | blocks | fontsizeselect ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'searchreplace codesample image emoticons mentions link table ' +
          'print help',
        content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:15px }`+
        `.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #9296b3; }`,
      }}
    />
  )
}
