import React from 'react'
import './styles/ChatConsole.css'
import IconContainer from "../ui/IconContainer"
import TextareaAutosize from 'react-textarea-autosize'

export default function ChatConsole(props) {

  const { inputPlaceholder, value, onChange } = props

  return (
    <div className="chat-console">
      <div className="top">
        <IconContainer
          icon="fas fa-plus"
        />
        <div className="input-container">
          <TextareaAutosize
            autoFocus
            placeholder={ inputPlaceholder }
            className="text-area-autosize"
            maxRows={ 5 }
            cacheMeasurements={ true }
            value={ value }
            onChange={ onChange }
          />
          <IconContainer
            icon="fas fa-paper-plane"
            iconSize={18}
            iconColor="var(--primary)"
            onClick={() => console.log("send")}
          />
        </div>
      </div>
      <div className="bottom">
        {/* attachment media show as slide on: files, images, videos */}
      </div>
    </div>
  )
}
