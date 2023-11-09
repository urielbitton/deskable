import React, { useContext } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { successToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"

export default function PageEditor(props) {

  const { setToasts, tinymceAPIKey } = useContext(StoreContext)
  const { editorRef, editorHeight = 300, customBtnOnClick,
    customBtnLabel, onEditorChange, onFocus, loadContent } = props

  return (
    <Editor
      apiKey={tinymceAPIKey}
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={loadContent || ''}
      onEditorChange={onEditorChange}
      onFocus={onFocus}
      init={{
        height: editorHeight,
        lineheight_formats: "0.5 0.75 1 1.25 1.5 2 3 4 5 6", 
        placeholder: 'Start jotting down ideas here...or use the sidebar templates to get inspired quickly.',
        menubar: false,
        statusbar: false,
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
          'codesample', 'template', 'fontSelect', 'fontsizeselect',
          'print', 'insertdatetime', 'pagebreak', 'code', 'lineheight', 
        ],
        toolbar: 'customBtn undo redo | blocks | fontsizeselect ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'searchreplace codesample code insertdatetime image emoticons link table ' +
          'print help lineheight',
        content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:15px } ` +
          `.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #9296b3; } ` +
          `td { padding: 0 5px } #tinymce { line-height: 0.4!important; }`,
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
