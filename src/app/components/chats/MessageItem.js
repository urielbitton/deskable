import React, { useContext } from 'react'
import { convertClassicDateAndTime, getTimeAgo } from "app/utils/dateUtils"
import { StoreContext } from "app/store/store"
import "./styles/MessageItem.css"
import Avatar from "../ui/Avatar"
import { ActionIcon } from "./ChatConsole"
import { useDocsCount } from "app/hooks/userHooks"
import { useSearchParams } from "react-router-dom"

export default function MessageItem(props) {

  const {myOrgID} = useContext(StoreContext)
  const {messageID, dateSent, senderID, dateModified,
    isDeleted, text, senderName, senderImg,
    isCombined, hasTimestamp, conversationID} = props.message
  const { parentMessage } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const messagePath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies`
  const messageRepliesNum = useDocsCount(messagePath, searchParams)
  const hasReplies = messageRepliesNum > 0
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

  return messageID ? (
    <div
      className={`message-container ${isCombined ? "combined" : ""} ${parentMessage ? "parent" : ""}`}
      key={messageID}
    >
      <div className="message-content">
        <div className="left-side">
          {
            (!isCombined || parentMessage) ?
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
        <div className="text-container">
          <div className="text">
            {
              (!isCombined || parentMessage) &&
              <div className="title">
                <h6>{senderName}</h6>
                <small title={fullTimestamp}>{shortTimestamp}</small>
              </div>
            }
            <p>{text}</p>
          </div>
          <div className="reactions-bar">

          </div>
          {
            (hasReplies && !parentMessage) &&
            <div className="replies-bar">
              <small onClick={() => setSearchParams({messageID})}>
                {messageRepliesNum} repl{messageRepliesNum !== 1 ? 'ies' : 'y'}. View Replies
              </small>
            </div>
          }
        </div>
      </div>
      <div className="options-floater">
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
        />
      </div>
    </div>
  ) : null
}
