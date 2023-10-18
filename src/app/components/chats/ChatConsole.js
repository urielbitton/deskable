import React from 'react'
import './styles/ChatConsole.css'
import IconContainer from "../ui/IconContainer"
import TextareaAutosize from 'react-textarea-autosize'
import AutoresizeWYSIWG from "../ui/AutoresizeWYSIWG"
import { chatConsoleIcons } from "app/data/chatsData"
import { hasWhiteSpace } from "app/utils/generalUtils"

export default function ChatConsole(props) {

  const { inputPlaceholder, value, onChange,
    onSendBtnClick, sendLoading, openEmojis,
    openFilesUpload, openMediaUpload, 
    openRecordAudio, toggleFormatting } = props
  const hasNoText = hasWhiteSpace(value)

  const handleOpenEmojis = () => {

  }

  const handleOpenFilesUpload = () => {

  }

  const handleOpenMediaUpload = () => {

  }

  const handleOpenRecordAudio = () => {

  }

  const handleToggleFormatting = () => {

  }

  const functionsArray = [
    openEmojis,
    openFilesUpload,
    openMediaUpload,
    openRecordAudio,
    toggleFormatting
  ]

  const iconsList = chatConsoleIcons?.map(icon => {
    return <ActionIcon
      key={ icon.label }
      icon={ icon.icon }
      label={icon.label}
      onClick={ () => functionsArray[icon.functionNum] }
    />
  })

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
            <TextareaAutosize
              autoFocus
              placeholder={ inputPlaceholder }
              className="text-area-autosize"
              maxRows={ 6 }
              minRows={ 1 }
              cacheMeasurements={ true }
              value={ value }
              onChange={ onChange }
              onKeyUp={ (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSendBtnClick(e)
                }
              }}
            />
            <div className="actions-bar">
              { iconsList }
            </div>
          </div>
          <IconContainer
            icon="fas fa-paper-plane"
            iconSize={ 18 }
            iconColor={ (sendLoading || hasNoText) ? "#ccc" : "var(--primary)" }
            onClick={ !sendLoading && onSendBtnClick }
            className={ (sendLoading || hasNoText) ? "disabled send-btn" : "send-btn" }
          />
        </div>
      </div>
      <div className="bottom">
        {/* attachment media show as slide on: files, images, videos */ }
      </div>
    </div>
  )
}

export const ActionIcon = ({ icon, onClick, label='', className='' }) => {
  return (
    <div
      className={`action-icon ${className}`}
      onClick={ onClick }
      title={label}
    >
      <i className={ icon } />
    </div>
  )
}