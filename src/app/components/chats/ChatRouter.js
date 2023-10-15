import React from 'react'
import ChatHeader from "./ChatHeader"
import ChatConsole from "./ChatConsole"
import ChatContent from "./ChatContent"
import { Route, Routes } from "react-router-dom"
import NewGroupMessage from "./NewGroupMessage"
import NewMessage from "./NewMessage"

export default function ChatRouter() {
  return (
    <div
      className="chat-router"
      style={ {
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-between',
        height: "100%",
        width: "100%",
        overflow: "hidden"
      } }
    >
      <Routes>
        <Route path=":chatID/*" element={
          <>
            <ChatHeader />
            <ChatContent />
            <ChatConsole />
          </>
        } />
        <Route path="new-message" element={<NewMessage />} />
        <Route path="new-group" element={<NewGroupMessage />} />
        <Route path="not-found" element={<div>Conversation not found...</div>} />
      </Routes>
    </div>
  )
}
