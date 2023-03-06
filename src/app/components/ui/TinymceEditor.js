import React, { useContext } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { successToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"

const tinymceAPIKey = process.env.REACT_APP_TINYMCEKEY

export default function TinymceEditor(props) {

  const { setToasts } = useContext(StoreContext)
  const { editorRef, editorHeight = 300, customBtnOnClick,
    customBtnLabel, onEditorChange, onFocus, loadContent,
    onCtrlSave, readOnly } = props

  return (
    <Editor
      apiKey={tinymceAPIKey}
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={loadContent || ''}
      onEditorChange={onEditorChange}
      onFocus={onFocus}
      init={{
        height: editorHeight,
        placeholder: 'Start jotting down ideas here...or use the sidebar templates to get inspired quickly.',
        menubar: false,
        statusbar: false,
        readOnly,
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        contextmenu: "link image inserttable | cell row column deletetable",
        setup: (editor) => {
          if (customBtnLabel) {
            editor.ui.registry.addButton('customBtn', {
              text: customBtnLabel,
              onAction: () => customBtnOnClick(),
            })
          }
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
        content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:15px } ` +
          `.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #9296b3; } ` +
          `td { padding: 0 5px }`,
        init_instance_callback: function (editor) {
          editor.addShortcut("ctrl+s", "Custom Ctrl+S", "custom_ctrl_s");
          editor.addCommand("custom_ctrl_s", function () {
            setToasts(successToast("Page saved!"))
          })
        }
      }}
    />
  )
}
