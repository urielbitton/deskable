import React, { useContext, useEffect } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import './styles/EmojiTextarea.css'
import TextareaAutosize from "react-textarea-autosize"
import IconContainer from "./IconContainer"
import { uploadMultipleFilesLocal } from "app/utils/fileUtils"
import { StoreContext } from "app/store/store"

export default function EmojiTextarea(props) {

  const { setToasts } = useContext(StoreContext)
  const { showPicker, setShowPicker, messageText, setMessageText,
    handlePressEnter, uploadedImgs, setUploadedImgs, loading, setLoading,
    enableImgUploading, showSend, uploadRef, maxRows } = props
  const isNotEmptyMessage = /\S/.test(messageText)
  const uploadedImgFiles = uploadedImgs.map(img => img)
  const maxFileSize = 1024 * 1024 * 2

  const uploadedImgFilesRender = uploadedImgFiles?.map((file, index) => {
    return file?.src ? <div
      className="upload-item"
      key={index}
    >
      <img
        src={file?.src}
        alt="upload"
      />
      <IconContainer
        icon="fal fa-times"
        dimensions={20}
        onClick={() => setUploadedImgs(uploadedImgs.filter((img, i) => i !== index))}
      />
    </div> :
      null
  })

  useEffect(() => {
    if (showPicker) {
      window.onclick = () => setShowPicker(false)
    }
    return () => window.onclick = null
  }, [showPicker])

  return (
    <div className="emoji-textarea">
      <div className="top-side">
        <TextareaAutosize
          placeholder="Type a message..."
          onChange={(e) => setMessageText((e.target.value))}
          value={messageText}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePressEnter && handlePressEnter(e)}
          className="emoji-picker-textarea"
          cacheMeasurements
          maxRows={maxRows}
        />
        {
          showPicker &&
          <div 
            className="picker-container"
            onClick={(e) => e.stopPropagation()}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setMessageText(`${messageText}${emoji.native}`)}
            />
          </div>
        }
        <div className="icons-row">
          {
            (!loading && showSend) ?
              <i
                className={`fas fa-paper-plane sendIcon ${(!isNotEmptyMessage && !uploadedImgs?.length) ? 'cant-send' : ''}`}
                onClick={(e) => handlePressEnter(e)}
              /> :
              loading &&
              <i className="fas fa-spinner fa-spin" />
          }
          {
            enableImgUploading &&
            <label className="icon-container">
              <i className="far fa-images" />
              <input
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                multiple
                ref={uploadRef}
                onChange={(e) => uploadMultipleFilesLocal(e, maxFileSize, setUploadedImgs, setLoading, setToasts)}
              />
            </label>
          }
          <IconContainer
            icon="far fa-smile"
            onClick={() => setShowPicker(prev => !prev)}
            tooltip="Add emojis"
            dimensions={30}
          />
        </div>
      </div>
      <div className="bottom-side">
        {
          uploadedImgs?.length > 0 &&
          <div className="uploaded-files-row">
            {uploadedImgFilesRender}
          </div>
        }
      </div>
    </div>
  )
}
