import useUser from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import Avatar from "../ui/Avatar"
import { getTimeAgo } from "app/utils/dateUtils"
import './styles/ChatCard.css'
import { Link } from "react-router-dom"
import { truncateText } from "app/utils/generalUtils"

export default function ChatCard(props) {

  const { myUserID, spaceChatDefaultImg } = useContext(StoreContext)
  const { conversationID, dateUpdated, participantID, 
    creatorID, lastMessage, blockedIDs, type,
    spaceName, isReadBy, participantsIDs } = props.chat
  const isSpaceChat = type === "space"
  const otherParticipantID = myUserID === participantID ? creatorID : participantID
  const otherParticipant = useUser(!isSpaceChat ? otherParticipantID : null)
  const isSentByMe = lastMessage?.senderID === myUserID
  const readByMe = isReadBy?.includes(myUserID)
  const otherParticipantName = `${otherParticipant?.firstName} ${otherParticipant?.lastName}`

  return (
    <Link 
      to={`/messages/${conversationID}`}
      className={`chat-card ${!readByMe ? 'unread' : ''}`}
      key={conversationID}
    >
      <div className="left-side">
        <Avatar
          src={!isSpaceChat ? otherParticipant?.photoURL : spaceChatDefaultImg}
          dimensions={30}
        />
        <div className="text-flex">
          <h4>{!isSpaceChat ? truncateText(otherParticipantName, 38) : truncateText(spaceName, 38)}</h4>
          <p>{isSentByMe ? 'You: ' : null}{truncateText(lastMessage?.text, 20)}</p>
        </div>
      </div>
      <div className="right-side">
        <small>{getTimeAgo(lastMessage?.dateSent?.toDate())}</small>
        { !readByMe && <div className="unread-badge"/> }
      </div>
    </Link>
  )
}
