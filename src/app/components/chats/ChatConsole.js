import React from 'react'
import './styles/ChatConsole.css'
import IconContainer from "../ui/IconContainer"
import TextareaAutosize from 'react-textarea-autosize'
import { hasWhiteSpace } from "app/utils/generalUtils"
import EmojiPicker from "../ui/EmojiPicker"
import { ActionIcon } from "../ui/ActionIcon"
import FileUploadBtn from "../ui/FileUploadBtn"
import AppScrollSlider from "../ui/AppScrollSlider"
import UploadFileItem from "../ui/UploadFileItem"

export default function ChatConsole(props) {

  const { inputPlaceholder, value, onChange,
    onSendBtnClick, sendLoading, showEmojiPicker,
    onReactionsClick, maxRows = 7, showFilesUpload = true,
    showRecorder = true, hideSendBtn, customBtns, 
    inputRef, onFileUploadChange, uploadedFiles,
    setUploadedFiles } = props
  const hasNoText = hasWhiteSpace(value)

  const uploadedFilesList = uploadedFiles?.map((file, index) => {
    return <UploadFileItem
      key={index}
      file={file?.file}
      src={file?.src}
      onCloseClick={() => setUploadedFiles(uploadedFiles.filter((f, i) => i !== index))}
    />
  })

  const handleEmojiClick = (emoji) => {
    const textarea = inputRef.current
    const { selectionStart, selectionEnd } = textarea
    const value = textarea.value
    const newValue = value.substring(0, selectionStart) + emoji.native + value.substring(selectionEnd, value.length)
    textarea.value = newValue
    textarea.setSelectionRange(selectionStart + emoji.native.length, selectionStart + emoji.native.length)
    onChange({ target: { value: newValue } })
    textarea.focus()
  }

  const handleRecordAudio = () => {

  }

  const handleToggleFormatting = () => {

  }

  return (
    <div className="chat-console">
      <div className="top">
        <div className="input-container">
          <div className="textarea-container">
            <div onClick={(e) => e.stopPropagation()}>
              <EmojiPicker
                onEmojiSelect={(emoji) => handleEmojiClick(emoji)}
                showPicker={showEmojiPicker}
              />
            </div>
            <TextareaAutosize
              autoFocus
              ref={inputRef}
              placeholder={inputPlaceholder}
              className="text-area-autosize"
              maxRows={maxRows}
              minRows={1}
              cacheMeasurements={true}
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSendBtnClick(e)
                }
              }}
            />
            <div className="actions-bar">
              <div className="left-side">
                <ActionIcon
                  label="Emojis"
                  icon="far fa-smile"
                  onClick={onReactionsClick}
                />
                {
                  showFilesUpload &&
                  <FileUploadBtn
                    className="action-icon"
                    iconLeft="fas fa-paperclip"
                    onChange={onFileUploadChange}
                  />
                }
                {
                  showRecorder &&
                  <ActionIcon
                    label="Record Audio"
                    icon="far fa-microphone"
                    onClick={handleRecordAudio}
                  />
                }
                <ActionIcon
                  label="Text Format"
                  icon="far fa-font-case"
                  onClick={handleToggleFormatting}
                />
              </div>
              {customBtns}
            </div>
          </div>
          {
            !hideSendBtn &&
            <IconContainer
              icon="fas fa-paper-plane"
              iconSize={18}
              iconColor={(sendLoading || hasNoText) ? "#ccc" : "var(--primary)"}
              onClick={!sendLoading && onSendBtnClick}
              className={(sendLoading || hasNoText) ? "disabled send-btn" : "send-btn"}
            />
          }
        </div>
      </div>
      <div className="bottom">
        {
          uploadedFiles?.length > 0 ?
          <div className="uploaded-files-row">
            <AppScrollSlider
              scrollAmount={100}
              fadeEnd="50px"
              hideArrows
            >
              {uploadedFilesList}
            </AppScrollSlider>
          </div> :
          null
        }
      </div>
    </div>
  )
}