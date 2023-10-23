import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  convertClassicDate, convertClassicDateAndTime,
  getShortTimeAgo, getTimeAgo
} from "app/utils/dateUtils"
import { StoreContext } from "app/store/store"
import "./styles/MessageItem.css"
import Avatar from "../ui/Avatar"
import { useDocsCount } from "app/hooks/userHooks"
import { Link, useSearchParams } from "react-router-dom"
import EmojiPicker from "../ui/EmojiPicker"
import {
  addEmojiReactionService, deleteMessageFilesService,
  deleteMessageService, handleReactionClickService,
  saveEditedMessageService
} from "app/services/chatServices"
import { useMessageReactions } from "app/hooks/chatHooks"
import ReactionsBubble from "./ReactionBubble"
import AppPortal from "../ui/AppPortal"
import { useScreenHeight } from "app/hooks/generalHooks"
import { ActionIcon } from "../ui/ActionIcon"
import ChatConsole from "./ChatConsole"
import AppButton from "../ui/AppButton"
import AppLink from "../ui/AppLink"
import FileAttachment from "../projects/FileAttachment"

export default function MessageItem(props) {

  const { myUserID, myUserName, myUserImg, myOrgID,
    setToasts } = useContext(StoreContext)
  const { messageID, dateSent, senderID, dateModified,
    isDeleted, text, senderName, senderImg, isCombined,
    hasTimestamp, conversationID, newDay, lastReply,
    files } = props.message
  const { parentMessage, showEmojiPicker, setShowEmojiPicker } = props
  const [openOptionsID, setOpenOptionsID] = useState(null)
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: '0', left: '0' })
  const [activeEditID, setActiveEditID] = useState(null)
  const [editMessageString, setEditMessageString] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const openReplies = searchParams.get("messageID")
  const messagePath = `organizations/${myOrgID}/conversations/${conversationID}/messages`
  const messageRepliesPath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies`
  const messageReactionsPath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/reactions`
  const messageRepliesNum = useDocsCount(messageRepliesPath, lastReply)
  const reactions = useMessageReactions(myOrgID, conversationID, messageID)
  const screenHeight = useScreenHeight()
  const reactionsNum = reactions?.length
  const reactionsSlice = 4
  const hasReplies = messageRepliesNum > 0
  const fullTimestamp = convertClassicDateAndTime(dateSent?.toDate())
  const mediumTimestamp = getTimeAgo(dateSent?.toDate())
  const smallTimestamp = getShortTimeAgo(dateSent?.toDate())
  const isMyMessage = senderID === myUserID
  const editingMessage = activeEditID === messageID
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
      messageReactionsPath
    )
  }

  const handleDeleteFile = (file) => {
    deleteMessageFilesService(
      messagePath,
      messageID,
      files,
      file?.fileID,
      file?.name,
      setToasts,
      () => null
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

  const filesList = files?.map((file, index) => {
    return <FileAttachment
      key={`${file.name}-${index}`}
      file={file}
      onClick={() => null}
      onDeleteFile={handleDeleteFile}
    />
  })

  const handleOpenEmojiPicker = (e) => {
    setShowEmojiPicker(prev => prev === messageID ? null : messageID)
    if (e.clientY > screenHeight / 2) {
      setEmojiPickerPosition({ top: `${((e.clientY - screenHeight / 2) - 15)}px`, left: 'calc(100% - 355px)' })
    } else {
      setEmojiPickerPosition({ top: `${e.clientY + 20}px`, left: 'calc(100% - 355px)' })
    }
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

  const handleEditMessage = () => {
    setActiveEditID(messageID)
    setEditMessageString(text)
    setOpenOptionsID(null)
  }

  const handleDeleteMessage = () => {
    const confirm = window.confirm("Are you sure you want to delete this message?")
    if (!confirm) return null
    deleteMessageService({
      docID: messageID,
      path: `organizations/${myOrgID}/conversations/${conversationID}/messages`,
      setToasts,
      setDeleteLoading
    })
  }

  const handleSaveMessage = () => {
    return saveEditedMessageService({
      text: editMessageString,
      messageID,
      conversationID,
      orgID: myOrgID,
    })
      .then(() => {
        cancelEditMessage()
      })
  }

  const cancelEditMessage = () => {
    setActiveEditID(null)
    setEditMessageString('')
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

  const seperatorDate = (dateSent) => {
    if (new Date().getDate() === dateSent?.toDate().getDate())
      return "Today"
    if (new Date().getDate() - 1 === dateSent?.toDate().getDate())
      return "Yesterday"
    return convertClassicDate(dateSent?.toDate())
  }

  useEffect(() => {
    window.onclick = () => setOpenOptionsID(null)
    return () => window.onclick = null
  })

  useEffect(() => {
    if (consoleInputRef?.current) {
      consoleInputRef?.current.setSelectionRange(consoleInputRef?.current.value.length, consoleInputRef?.current.value.length)
      consoleInputRef?.current.focus()
    }
  }, [editingMessage])

  return messageID ? (
    <>
      <div
        className={`
        message-container 
        ${isCombined ? "combined" : ""} 
        ${parentMessage ? "parent" : ""} 
        ${openReplies ? "open-replies" : ""}
        ${openOptionsID === messageID ? "open-options" : ""}
        ${editingMessage ? "editing" : ""}
      `}
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
                >{smallTimestamp}</small>
            }
          </div>
          <div className="text-container">
            <div className="text">
              {
                (!isCombined || parentMessage) && !editingMessage &&
                <div className="title">
                  <h6>
                    <Link to={`/employees/${senderID}`}>{senderName}</Link>
                  </h6>
                  <small title={fullTimestamp}>{mediumTimestamp}</small>
                </div>
              }
              {
                editingMessage ?
                  <ChatConsole
                    inputRef={consoleInputRef}
                    inputPlaceholder="Edit message..."
                    value={editMessageString}
                    onChange={(e) => setEditMessageString(e.target.value)}
                    sendLoading={saveLoading}
                    showEmojiPicker={showEditEmojiPicker}
                    onSendBtnClick={() => null}
                    onReactionsClick={(e) => {
                      e.stopPropagation()
                      setShowEditEmojiPicker(prev => !prev)
                    }}
                    showFilesUpload={false}
                    showRecorder={false}
                    hideSendBtn
                    customBtns={editConsoleBtns}
                  /> :
                  !isDeleted ?
                    <p>
                      <AppLink text={text} />&nbsp;
                      {dateModified && <small className="edited">(Edited)</small>}
                    </p> :
                    <small>This message was deleted.</small>
              }
              {
                files ?
                  <div className="files-flex">
                    {filesList}
                  </div> :
                  null
              }
              {deleteLoading && <small>Deleting...</small>}
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
        {
          !isDeleted &&
          <div
            className={`options-floater ${showEmojiPicker === messageID ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <AppPortal
              showPortal={showEmojiPicker === messageID}
              className="emoji-picker-float"
              style={{ position: 'absolute', top: emojiPickerPosition.top, left: emojiPickerPosition.left, zIndex: 1000 }}
            >
              <EmojiPicker
                showPicker
                onEmojiSelect={handleEmojiSelect}
              />
            </AppPortal>
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
              {
                isMyMessage &&
                <>
                  <h6 onClick={handleEditMessage}><i className="far fa-pen" />Edit Message</h6>
                  <h6 onClick={handleDeleteMessage}><i className="far fa-trash" />Delete Message</h6>
                </>
              }
              <h6><i className="far fa-thumbtack" />Pin Message</h6>
              <h6><i className="far fa-flag" />Report Message</h6>
            </div>
          </div>
        }
      </div>
      {
        newDay &&
        <div
          className="date-seperator"
          key={`${messageID}-seperator`}
        >
          <div className="seperator-row">
            <hr />
            <small>{seperatorDate(dateSent)}</small>
          </div>
        </div>
      }
    </>
  ) : null
}
