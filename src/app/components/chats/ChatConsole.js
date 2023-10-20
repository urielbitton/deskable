import React, { useRef } from 'react'
import './styles/ChatConsole.css'
import IconContainer from "../ui/IconContainer"
import TextareaAutosize from 'react-textarea-autosize'
import AutoresizeWYSIWG from "../ui/AutoresizeWYSIWG"
import { hasWhiteSpace } from "app/utils/generalUtils"
import EmojiPicker from "../ui/EmojiPicker"
import { ActionIcon } from "../ui/ActionIcon"

export default function ChatConsole(props) {

  const { inputPlaceholder, value, onChange,
    onSendBtnClick, sendLoading, showEmojiPicker, 
    onReactionsClick, maxRows=7 } = props
  const hasNoText = hasWhiteSpace(value)
  const consoleInputRef = useRef(null)

  const handleAttachFiles = () => {
    
  }

  const handleEmojiClick = (emoji) => {
    const textarea = consoleInputRef.current
    const { selectionStart, selectionEnd } = textarea
    const value = textarea.value
    const newValue = value.substring(0, selectionStart) + emoji.native + value.substring(selectionEnd, value.length)
    textarea.value = newValue
    textarea.setSelectionRange(selectionStart + emoji.native.length, selectionStart + emoji.native.length)
    onChange({ target: { value: newValue } })
    textarea.focus()
  }

  const handleUploadMedia = () => {

  }

  const handleRecordAudio = () => {

  }

  const handleToggleFormatting = () => {

  }

  return (
    <div className="chat-console">
      <div className="top">
        <div className="input-container">
          {/* <AutoresizeWYSIWG
            config={ {
              documentReady: true,
              heightMin: 200,
              heightMax: 400,
              events: {
                'contentChanged': function (e, editor) {
                  console.log('test')
                }
              }
            }}
          /> */}
          <div className="textarea-container">
            <div onClick={(e) => e.stopPropagation()}>
              <EmojiPicker
                onEmojiSelect={(emoji) => handleEmojiClick(emoji)}
                showPicker={showEmojiPicker}
              />
            </div>
            <TextareaAutosize
              autoFocus
              ref={consoleInputRef}
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
              <ActionIcon
                label="Emojis"
                icon="far fa-smile"
                onClick={onReactionsClick}
              />
              <ActionIcon
                icon="fas fa-paperclip"
                label="Attach files"
                onClick={handleAttachFiles}
              />
              <ActionIcon
                label="Upload Media"
                icon="far fa-photo-video"
                onClick={handleUploadMedia}
              />
              <ActionIcon
                label="Record Audio"
                icon="far fa-microphone"
                onClick={handleRecordAudio}
              />
              <ActionIcon
                label="Text Format"
                icon="far fa-font-case"
                onClick={handleToggleFormatting}
              />
            </div>
          </div>
          <IconContainer
            icon="fas fa-paper-plane"
            iconSize={18}
            iconColor={(sendLoading || hasNoText) ? "#ccc" : "var(--primary)"}
            onClick={!sendLoading && onSendBtnClick}
            className={(sendLoading || hasNoText) ? "disabled send-btn" : "send-btn"}
          />
        </div>
      </div>
      <div className="bottom">
        {/* attachment media show as slide on: files, images, videos */}
      </div>
    </div>
  )
}