import React, { useContext } from 'react'
import './styles/ReactionBubble.css'
import { StoreContext } from "app/store/store"

export default function ReactionBubble(props) {

  const { myUserID } = useContext(StoreContext)
  const { reactionID, emoji, reactionCount, users, dateAdded } = props.reaction
  const { onClick } = props
  const hasReacted = users?.filter(user => user.userID === myUserID).length

  return (
    <div
      key={reactionID}
      className={`reaction-bubble ${hasReacted ? "has-reacted" : ""}`}
      onClick={onClick}
    >
      <span>{emoji?.native}</span>
      <small>{reactionCount}</small>
    </div>
  )
}
