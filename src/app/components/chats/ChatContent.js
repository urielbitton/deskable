import React, { useContext } from 'react'
import './styles/ChatContent.css'
import { StoreContext } from "app/store/store"
import { useParams } from "react-router-dom"
import { useChat, useGroupChat } from "app/hooks/chatHooks"
import useUser from "app/hooks/userHooks"

export default function ChatContent() {

  const { myUserID, myOrgID } = useContext(StoreContext)
  const chatID = useParams().chatID
  const singleChat = useChat(myUserID, chatID)
  const groupChat = useGroupChat(myOrgID, chatID)
  const chat = { ...singleChat, ...groupChat }
  const isGroupChat = chat?.type === "group"
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const otherParticipant = useUser(!isGroupChat ? otherParticipantID : null)

  return (
    <div className="chat-content">
      <div className="new-conversation-info">

      </div>
    </div>
  )
}
