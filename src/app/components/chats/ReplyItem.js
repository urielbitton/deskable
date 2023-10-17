import {StoreContext} from "app/store/store"
import React, {useContext} from 'react'
import Avatar from "../ui/Avatar"
import {convertClassicDateAndTime, getTimeAgo} from "app/utils/dateUtils"
import {ActionIcon} from "./ChatConsole"
import "./styles/MessageItem.css"

export default function ReplyItem(props) {

  const {myOrgID, myUserID} = useContext(StoreContext)
  const {replyID, dateSent, senderID, dateModified,
    isDeleted, text, senderName, senderImg, messageID,
    isCombined, hasTimestamp, conversationID} = props.reply
  const fullTimestamp = convertClassicDateAndTime(dateSent?.toDate())
  const shortTimestamp = getTimeAgo(dateSent?.toDate()).replace(/am|pm/gi, "")

  const handleOpenEmojiPicker = () => {

  }

  const handleReply = () => {

  }

  const handleShare = () => {

  }

  const handleMoreOptions = () => {

  }

  return (
    <div
      className={`message-container ${isCombined ? "combined" : ""}`}
      key={replyID}
    >
      <div className="message-content">
        <div className="left-side">
          {
            !isCombined ?
              <Avatar
                src={senderImg}
                dimensions={30}
                round={false}
              /> :
              <small 
                className="hover-timestamp"
                title={fullTimestamp}
              >{shortTimestamp}</small>
          }
        </div>
        <div className="text">
          {
            !isCombined &&
            <div className="title">
              <h6>{senderName}</h6>
              <small title={fullTimestamp}>{shortTimestamp}</small>
            </div>
          }
          <p>{text}</p>
        </div>
      </div>
      <div className="options-floater">
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
        />
      </div>
    </div>
  )
}
