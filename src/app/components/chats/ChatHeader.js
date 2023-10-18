import React, { useContext } from 'react'
import './styles/ChatHeader.css'
import IconContainer from "../ui/IconContainer"
import { useChat, useSpaceChat } from "app/hooks/chatHooks"
import { StoreContext } from "app/store/store"
import { useParams } from "react-router-dom"
import Avatar from "../ui/Avatar"
import useUser from "app/hooks/userHooks"

export default function ChatHeader() {

  const { myUserID, myOrgID, spaceChatDefaultImg } = useContext(StoreContext)
  const conversationID = useParams().conversationID
  const singleChat = useChat(myUserID, conversationID)
  const spaceChat = useSpaceChat(myOrgID, conversationID)
  const chat = { ...singleChat, ...spaceChat }
  const isSpaceChat = chat?.type === "space"
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const otherParticipant = useUser(!isSpaceChat ? otherParticipantID : null)

  const handleAddParticipant = () => {

  }

  return (
    <div 
      className="chat-header"
      key={conversationID}
    >
      <div className="left-side">
        <Avatar
          src={!isSpaceChat ? otherParticipant?.photoURL : spaceChatDefaultImg}
          dimensions={38}
        />
        <div className="text">
          <h5>{!isSpaceChat ? `${otherParticipant?.firstName} ${otherParticipant?.lastName}` : chat?.spaceName}</h5>
          <small>Active now</small>
        </div>
      </div>
      <div className="right-side">
        <IconContainer
          icon="far fa-user-plus"
          onClick={handleAddParticipant}
          iconSize={15}
          iconColor="var(--grayText)"
          round={false}
        />
        <IconContainer
          icon="far fa-info-circle"
          onClick={() => console.log("info")}
          iconSize={17}
          iconColor="var(--grayText)"
          round={false}
        />
      </div>
    </div>
  )
}
