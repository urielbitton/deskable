import React from 'react'
import selectImg from "app/assets/images/select-chat-img.png"
import AppButton from "../ui/AppButton"

export default function SelectChat() {
  return (
    <div className="select-chat">
      <img src={selectImg} alt="chatting" />
      <h3>Select a conversation</h3>
      <p>Select an existing conversation or create a new one below</p>
      <AppButton
        label="New Conversation"
        leftIcon="fas fa-plus"
        url="/messages/new-conversation"
      />
    </div>
  )
}
