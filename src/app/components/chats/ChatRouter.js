import React from 'react'
import { Route, Routes } from "react-router-dom"
import NewMessage from "./NewMessage"
import SelectChat from "./SelectChat"
import "./styles/ChatRouter.css"
import ConversationContainer from "./ConversationContainer"
import ChatNotFound from "./ChatNotFound"

export default function ChatRouter() {
  return (
    <div className="chat-router">
      <Routes>
        <Route index element={<SelectChat />} />
        <Route path=":conversationID/*" element={<ConversationContainer />} />
        <Route path="new-conversation" element={<NewMessage />} />
        <Route path="not-found" element={<ChatNotFound />} />
      </Routes>
    </div>
  )
}
