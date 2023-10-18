import React, { useContext } from 'react'
import './styles/ChatSidebar.css'
import { useListOfSingleChats, 
  useListOfSpaceChats } from "app/hooks/chatHooks"
import { StoreContext } from "app/store/store"
import ChatCard from "./ChatCard"
import { ActionIcon } from "./ChatConsole"
import { useNavigate } from "react-router-dom"
import { AppInput } from "../ui/AppInputs"

export default function ChatSidebar() {

  const { myOrgID, myUserID } = useContext(StoreContext)
  const spaceChats = useListOfSpaceChats(myOrgID)
  const singleChats = useListOfSingleChats(myOrgID, myUserID)
  const navigate = useNavigate()

  const spaceChatsList = spaceChats?.map(chat => {
    return <ChatCard
      key={ chat.conversationID }
      chat={ chat }
    />
  })

  const singleChatsList = singleChats?.map(chat => {
    return <ChatCard
      key={ chat.conversationID }
      chat={ chat }
    />
  })

  return (
    <div className="chat-sidebar">
      <header>
        <h3>Messages</h3>
        <ActionIcon
          icon="far fa-plus"
          label="New Chat"
          onClick={ () => navigate("/messages/new-conversation") }
        />
      </header>
      <div className="search-bar">
        <AppInput
          placeholder="Search conversations"
          iconright={<i className="far fa-search"/>}
        />
      </div>
      <div className="chats-list">
        <div className="chat-type-flex">
          <h5><i className="fas fa-users"/>Spaces</h5>
          <div className="chat-type-list">
            { spaceChatsList }
          </div>
        </div>
        <div className="chat-type-flex">
          <h5><i className="fas fa-comment"/>Direct</h5>
          <div className="chat-type-list">
            { singleChatsList }
          </div>
        </div>
      </div>
    </div>
  )
}
