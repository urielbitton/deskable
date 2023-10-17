import React from 'react'
import { Route, Routes } from "react-router-dom"
import NewGroupMessage from "./NewGroupMessage"
import NewMessage from "./NewMessage"
import SelectChat from "./SelectChat"
import "./styles/ChatRouter.css"
import ConversationContainer from "./ConversationContainer"

export default function ChatRouter() {
  return (
    <div className="chat-router">
      <Routes>
        <Route index element={<SelectChat />} />
        <Route path=":conversationID/*" element={<ConversationContainer />} />
        <Route path="new-conversation" element={<NewMessage />} />
        <Route path="new-group" element={<NewGroupMessage />} />
        <Route path="not-found" element={<div>Conversation not found...</div>} />
      </Routes>
    </div>
  )
}
