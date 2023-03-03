import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const tinymceAPIKey = process.env.REACT_APP_TINYMCEKEY

export default function TinymceReader(props) {

  const { editorRef, editorHeight=300 } = props

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
        menubar: false,
        statusbar: false,
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'fullscreen', 'emoticons',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'inlinecode',
          'codesample', 'template', 'fontSelect', 'fontsizeselect', 'mentions',
          'preview', 'print'
        ],
        toolbar: 'undo redo | blocks | fontsizeselect ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'template searchreplace codesample image emoticons mentions link table help ' +
          '| preview print',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  )
}
