import React, { useContext } from 'react'
import './styles/ChatHeader.css'
import IconContainer from "../ui/IconContainer"
import { useChat, useGroupChat } from "app/hooks/chatHooks"
import { StoreContext } from "app/store/store"
import { useParams } from "react-router-dom"
import Avatar from "../ui/Avatar"
import useUser from "app/hooks/userHooks"

export default function ChatHeader() {

  const { myUserID, myOrgID, groupChatDefaultImg } = useContext(StoreContext)
  const chatID = useParams().chatID
  const singleChat = useChat(myUserID, chatID)
  const groupChat = useGroupChat(myOrgID, chatID)
  const chat = { ...singleChat, ...groupChat }
  const isGroupChat = chat?.type === "group"
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const otherParticipant = useUser(!isGroupChat ? otherParticipantID : null)

  return (
    <div className="chat-header">
      <div className="left-side">
        <Avatar
          src={!isGroupChat ? otherParticipant?.photoURL : groupChatDefaultImg}
          dimensions={38}
        />
        <div className="text">
          <h5>{!isGroupChat ? `${otherParticipant?.firstName} ${otherParticipant?.lastName}` : chat?.chatName}</h5>
          <small>Active now</small>
        </div>
      </div>
      <div className="right-side">
        <IconContainer
          icon="far fa-info-circle"
          onClick={() => console.log("info")}
          iconSize={18}
          iconColor="var(--grayText)"
        />
      </div>
    </div>
  )
}
