import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import Avatar from "../ui/Avatar"
import { convertClassicDateAndTime, getTimeAgo } from "app/utils/dateUtils"
import "./styles/MessageItem.css"
import { Link } from "react-router-dom"
import { addEmojiReactionService, handleReactionClickService, saveEditedReplyService } from "app/services/chatServices"
import { useReplyReactions } from "app/hooks/chatHooks"
import ReactionsBubble from "./ReactionBubble"
import { ActionIcon } from "../ui/ActionIcon"
import ChatConsole from "./ChatConsole"
import AppButton from "../ui/AppButton"
import AppLink from "../ui/AppLink"

export default function ReplyItem(props) {

  const { myOrgID, myUserID, myUserName, myUserImg } = useContext(StoreContext)
  const { replyID, dateSent, senderID, dateModified,
    isDeleted, text, senderName, senderImg, messageID,
    isCombined, hasTimestamp, conversationID } = props.reply
  const { showReplyEmojiPicker, setShowReplyEmojiPicker,
    handleOpenEmojiPicker } = props
  const [openOptionsID, setOpenOptionsID] = useState(null)
  const [editingReply, setEditingReply] = useState(false)
  const [editReplyString, setEditReplyString] = useState(text)
  const [saveLoading, setSaveLoading] = useState(false)
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false)
  const [activeEditID, setActiveEditID] = useState(null)
  const reactionsSlice = 4
  const reactions = useReplyReactions(myOrgID, conversationID, messageID, replyID)
  const fullTimestamp = convertClassicDateAndTime(dateSent?.toDate())
  const shortTimestamp = getTimeAgo(dateSent?.toDate()).replace(/am|pm/gi, "")
  const replyReactionsPath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies/${replyID}/reactions`
  const reactionsNum = reactions?.length
  const consoleInputRef = useRef(null)

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
      replyReactionsPath
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

  const handleReply = () => {

  }

  const handleShare = () => {

  }

  const handleMoreOptions = () => {
    if (openOptionsID === replyID) {
      setOpenOptionsID(null)
    } else {
      setOpenOptionsID(replyID)
    }
  }

  const handleSaveMessage = () => {
    return saveEditedReplyService({
      text: editReplyString,
      messageID,
      replyID,
      conversationID,
      orgID: myOrgID,
    })
      .then(() => {
        cancelEditMessage()
      })
  }

  const cancelEditMessage = () => {
    setActiveEditID(null)
    setEditReplyString('')
  }

  const editConsoleBtns = (
    <div className="custom-edit-btns">
      <AppButton
        label="Save"
        onClick={handleSaveMessage}
      />
      <AppButton
        label="Cancel"
        onClick={cancelEditMessage}
        buttonType="outlineBtn"
      />
    </div>
  )

  useEffect(() => {
    window.onclick = () => setOpenOptionsID(null)
    return () => window.onclick = null
  }, [])

  return (
    <div
      className={`
    message-container reply-container 
    ${isCombined ? "combined" : ""} 
    ${openOptionsID === replyID ? "open-options" : ""}
  `}
      data-reply-id={replyID}
      key={replyID}
    >
      <div className="message-content">
        <div className="left-side">
          {
            !isCombined ?
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
              !isCombined &&
              <div className="title">
                <h6>
                  <Link to={`/employees/${senderID}`}>{senderName}</Link>
                </h6>
                <small title={fullTimestamp}>{shortTimestamp}</small>
              </div>
            }
            {
              editingReply ?
                <ChatConsole
                  inputRef={consoleInputRef}
                  inputPlaceholder="Edit message..."
                  value={editReplyString}
                  onChange={(e) => setEditReplyString(e.target.value)}
                  sendLoading={saveLoading}
                  showEmojiPicker={showEditEmojiPicker}
                  onSendBtnClick={() => null}
                  onReactionsClick={(e) => {
                    e.stopPropagation()
                    setShowEditEmojiPicker(prev => !prev)
                  }}
                  showFilesUpload={false}
                  showMediaUpload={false}
                  showRecorder={false}
                  hideSendBtn
                  customBtns={editConsoleBtns}
                /> :
                <p>
                  <AppLink text={text} />&nbsp;
                  {dateModified && <small className="edited">(Edited)</small>}
                </p>
            }
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
        </div>
      </div>
      <div
        className={`options-floater ${showReplyEmojiPicker === replyID ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="icons-bar">
          <ActionIcon
            icon="far fa-smile-plus"
            onClick={handleOpenEmojiPicker}
            label="Reactions"
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
            className={openOptionsID === replyID ? "active" : ""}
          />
        </div>
        <div className={`options-flex ${openOptionsID === replyID ? "open" : ""}`}>
          <h6>Edit Message</h6>
          <h6>Delete Message</h6>
          <h6>Pin Message</h6>
        </div>
      </div>
    </div>
  )
}
