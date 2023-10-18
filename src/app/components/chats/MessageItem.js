import React, { useContext, useEffect, useState } from 'react'
import { convertClassicDateAndTime, getTimeAgo } from "app/utils/dateUtils"
import { StoreContext } from "app/store/store"
import "./styles/MessageItem.css"
import Avatar from "../ui/Avatar"
import { ActionIcon } from "./ChatConsole"
import { useDocsCount } from "app/hooks/userHooks"
import { Link, useSearchParams } from "react-router-dom"
import EmojiPicker from "../ui/EmojiPicker"
import { addEmojiReactionService, handleReactionClickService } from "app/services/chatServices"
import { useMessageReactions } from "app/hooks/chatHooks"
import ReactionsBubble from "./ReactionBubble"

export default function MessageItem(props) {

  const { myUserID, myUserName, myUserImg, myOrgID } = useContext(StoreContext)
  const { messageID, dateSent, senderID, dateModified,
    isDeleted, text, senderName, senderImg,
    isCombined, hasTimestamp, conversationID } = props.message
  const { parentMessage, showEmojiPicker, setShowEmojiPicker } = props
  const [openOptionsID, setOpenOptionsID] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const openReplies = searchParams.get("messageID")
  const messagePath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies`
  const messageReactionsPath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/reactions`
  const messageRepliesNum = useDocsCount(messagePath, searchParams)
  const reactions = useMessageReactions(myOrgID, conversationID, messageID)
  const reactionsNum = reactions?.length
  const reactionsSlice = 4
  const hasReplies = messageRepliesNum > 0
  const fullTimestamp = convertClassicDateAndTime(dateSent?.toDate())
  const shortTimestamp = getTimeAgo(dateSent?.toDate()).replace(/am|pm/gi, "")

  const handleReactionClick = (reaction) => {
    handleReactionClickService(
      {
        emoji: reaction?.emoji,
        reactionUsers: reaction?.users
      }, 
      {
        userID: myUserID,
        userName: myUserName,
        userImg: myUserImg,
      }, 
      messageReactionsPath
    )
  }

  const reactionsList = reactions
  ?.slice(0, reactionsSlice)
  .map(reaction => {
    return <ReactionsBubble
      key={reaction.reactionID}
      reaction={reaction}
      onClick={() => handleReactionClick(reaction)}
    />
  })

  const handleOpenEmojiPicker = () => {
    setShowEmojiPicker(prev => prev === messageID ? null : messageID)
  }

  const handleEmojiSelect = (emoji) => {
    setShowEmojiPicker(null)
    addEmojiReactionService({
      emoji,
      userID: myUserID,
      userName: myUserName,
      userImg: myUserImg,
    },
      messageReactionsPath
    )
  }

  const handleReply = () => {
    setSearchParams({ messageID })
  }

  const handleShare = () => {

  }

  const handleMoreOptions = () => {
    if (openOptionsID === messageID) {
      setOpenOptionsID(null)
    } else {
      setOpenOptionsID(messageID)
    }
  }

  useEffect(() => {
    window.onclick = () => setOpenOptionsID(null)
    return () => window.onclick = null
  })

  return messageID ? (
    <div
      className={`
        message-container 
        ${isCombined ? "combined" : ""} 
        ${parentMessage ? "parent" : ""} 
        ${openReplies ? "open-replies" : ""}
        ${openOptionsID === messageID ? "open-options" : ""}
      `}
      data-message-id={messageID}
      key={messageID}
    >
      <div className="message-content">
        <div className="left-side">
          {
            (!isCombined || parentMessage) ?
              <Link to={`/employees/${senderID}`}>
                <Avatar
                  src={senderImg}
                  dimensions={30}
                  round={false}
                />
              </Link> :
              <small
                className="hover-timestamp"
                title={fullTimestamp}
              >{shortTimestamp}</small>
          }
        </div>
        <div className="text-container">
          <div className="text">
            {
              (!isCombined || parentMessage) &&
              <div className="title">
                <h6>
                  <Link to={`/employees/${senderID}`}>{senderName}</Link>
                </h6>
                <small title={fullTimestamp}>{shortTimestamp}</small>
              </div>
            }
            <p>{text}</p>
          </div>
          <div className="reactions-bar">
            {reactionsList}
            {
              reactionsNum > reactionsSlice &&
              <div className="reaction-bubble">
                <small>{reactionsNum - reactionsSlice}+ more</small>
              </div>
            }
          </div>
          {
            (hasReplies && !parentMessage) &&
            <div className="reply-bar">
              <small onClick={() => setSearchParams({ messageID })}>
                <i className="far fa-comment-lines" />
                <span>{messageRepliesNum} repl{messageRepliesNum !== 1 ? 'ies' : 'y'}.</span>
                <b>View Replies</b>
              </small>
            </div>
          }
        </div>
      </div>
      <div
        className={`options-floater ${showEmojiPicker === messageID ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="emoji-picker-float">
          <EmojiPicker
            showPicker={showEmojiPicker === messageID}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
        <div className="icons-bar">
          <ActionIcon
            icon="far fa-smile-plus"
            onClick={handleOpenEmojiPicker}
            label="Reactions"
          />
          <ActionIcon
            icon="far fa-comment-lines"
            onClick={handleReply}
            label="Reply"
          />
          <ActionIcon
            icon="far fa-share"
            onClick={handleShare}
            label="Forward"
          />
          <ActionIcon
            icon="far fa-ellipsis-v"
            onClick={handleMoreOptions}
            label="More Options"
            className={openOptionsID === messageID ? "active" : ""}
          />
        </div>
        <div className={`options-flex ${openOptionsID === messageID ? "open" : ""}`}>
          <h6>Edit Message</h6>
          <h6>Delete Message</h6>
          <h6>Pin Message</h6>
        </div>
      </div>
    </div>
  ) : null
}
