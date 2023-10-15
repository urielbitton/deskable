import useUser from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import Avatar from "../ui/Avatar"
import { getTimeAgo } from "app/utils/dateUtils"
import './styles/ChatCard.css'
import { Link } from "react-router-dom"

export default function ChatCard(props) {

  const { myUserID, groupChatDefaultImg } = useContext(StoreContext)
  const { conversationID, dateUpdated, participantID, 
    creatorID, lastMessage, blockedIDs, type,
    chatName } = props.chat
  const isGroupChat = type === "group"
  const otherParticipantID = myUserID === participantID ? creatorID : participantID
  const otherParticipant = useUser(!isGroupChat ? otherParticipantID : null)
  const isSentByMe = lastMessage?.senderID === myUserID

  return (
    <Link 
      to={`/messages/${conversationID}`}
      className="chat-card"
      key={conversationID}
    >
      <div className="left-side">
        <Avatar
          src={!isGroupChat ? otherParticipant?.photoURL : groupChatDefaultImg}
          dimensions={30}
        />
        <div className="text-flex">
          <h4>{!isGroupChat ? `${otherParticipant?.firstName} ${otherParticipant?.lastName}` : chatName}</h4>
          <p>{isSentByMe ? 'You: ' : null}{lastMessage?.text}</p>
        </div>
      </div>
      <div className="right-side">
        <small>{getTimeAgo(dateUpdated?.toDate())}</small>
        <div className="unread-badge" />
      </div>
    </Link>
  )
}
