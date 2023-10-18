import React from 'react'
import chatNotFoundImg from "app/assets/images/chat-not-found.png"
import AppButton from "../ui/AppButton"

export default function ChatNotFound() {
  return (
    <div className="select-chat">
      <img src={chatNotFoundImg} alt="not-found" />
      <h3>Conversation Not Found</h3>
      <p>The conversation you are looking for does not exist</p>
      <AppButton
        label="New Conversation"
        leftIcon="fas fa-plus"
        url="/messages/new-conversation"
      />
    </div>
  )
}
