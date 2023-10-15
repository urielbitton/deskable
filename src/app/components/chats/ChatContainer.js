import React from 'react'
import './styles/ChatContainer.css'
import ChatSidebar from "./ChatSidebar"
import ChatRouter from "./ChatRouter"

export default function ChatContainer() {
  return (
    <div className="chat-container">
      <ChatSidebar /> 
      <ChatRouter />
    </div>
  )
}
