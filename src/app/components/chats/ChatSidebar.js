import React, { useContext } from 'react'
import './styles/ChatSidebar.css'
import IconContainer from "../ui/IconContainer"
import { useListOfGroupChats, useListOfSingleChats } from "app/hooks/chatHooks"
import { StoreContext } from "app/store/store"
import ChatCard from "./ChatCard"

export default function ChatSidebar() {

  const { myOrgID, myUserID } = useContext(StoreContext)
  const groupChats = useListOfGroupChats(myOrgID)
  const singleChats = useListOfSingleChats(myUserID)

  const groupChatsList = groupChats?.map(chat => {
    return <ChatCard
      key={ chat.chatID }
      chat={ chat }
    />
  })

  const singleChatsList = singleChats?.map(chat => {
    return <ChatCard
      key={ chat.chatID }
      chat={ chat }
    />
  })

  return (
    <div className="chat-sidebar">
      <header>
        <h3>Messages</h3>
        <IconContainer
          icon="fas fa-plus"
          className="new-button"
          onClick={ () => console.log("New chat") }
          round={ false }
          dimensions={ 30 }
          iconSize={ 15 }
        />
      </header>
      <div className="chats-list">
        <div className="chat-type-flex">
          <h5><i className="fas fa-users"/>Groups</h5>
          <div className="chat-type-list">
            { groupChatsList }
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
