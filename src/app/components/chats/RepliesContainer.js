import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatConsole from "./ChatConsole"
import './styles/RepliesContainer.css'
import { useParams, useSearchParams } from "react-router-dom"
import { useChatMessage } from "app/hooks/chatHooks"
import { StoreContext } from "app/store/store"
import ReplyItem from "./ReplyItem"
import MessageItem from "./MessageItem"
import { useDocsCount } from "app/hooks/userHooks"
import { useScreenHeight } from "app/hooks/generalHooks"
import AppPortal from "../ui/AppPortal"
import EmojiPicker from "@emoji-mart/react"
import { ActionIcon } from "../ui/ActionIcon"
import { addEmojiReactionService } from "app/services/chatServices"
import { uploadMultipleFilesLocal } from "app/utils/fileUtils"

export default function RepliesContainer(props) {

  const { myOrgID, myUserID, myUserName,
    myUserImg, setToasts } = useContext(StoreContext)
  const { replies, onReplyChange, value,
    handleSendReply, replyLoading, open, onClose,
    showReplyEmojiPicker, setShowReplyEmojiPicker } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const [showReplyConsoleEmojiPicker, setShowReplyConsoleEmojiPicker] = useState(false)
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: '0', left: '0' })
  const [openReplyID, setOpenReplyID] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadFilesLoading, setUploadFilesLoading] = useState(false)
  const screenHeight = useScreenHeight()
  const conversationID = useParams().conversationID
  const messageID = searchParams.get('messageID')
  const messagePath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies`
  const replyReactionsPath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies/${openReplyID}/reactions`
  const message = useChatMessage(myOrgID, conversationID, messageID)
  const messageRepliesNum = useDocsCount(messagePath, message)
  const consoleInputRef = useRef(null)
  const maxFileSize = 10 * 1024 * 1024
  const maxFilesNum = 10

  const handleOpenEmojiPicker = (e, reply) => {
    e.stopPropagation()
    setOpenReplyID(reply.replyID)
    setShowReplyEmojiPicker(!showReplyEmojiPicker)
    if (e.clientY > screenHeight / 2) {
      setEmojiPickerPosition({ top: `${((e.clientY - screenHeight / 2) - 15)}px`, left: 'calc(100% - 355px)' })
    } else {
      setEmojiPickerPosition({ top: `${e.clientY + 20}px`, left: 'calc(100% - 355px)' })
    }
  }

  const repliesList = replies?.map(reply => {
    return <ReplyItem
      key={reply.replyID}
      reply={reply}
      showReplyEmojiPicker={showReplyEmojiPicker}
      setShowReplyEmojiPicker={setShowReplyEmojiPicker}
      handleOpenEmojiPicker={(e) => handleOpenEmojiPicker(e, reply)}
    />
  })

  const handleEmojiSelect = (emoji) => {
    setShowReplyEmojiPicker(null)
    addEmojiReactionService({
      emoji,
      userID: myUserID,
      userName: myUserName,
      userImg: myUserImg,
    },
      replyReactionsPath
    )
  }

  const handleFileUploadChange = (e) => {
    return uploadMultipleFilesLocal(
      e,
      maxFileSize,
      maxFilesNum,
      setUploadedFiles,
      setUploadFilesLoading,
      setToasts
    )
  }

  useEffect(() => {
    window.onclick = () => {
      setShowReplyConsoleEmojiPicker(false)
      setShowReplyEmojiPicker(false)
    }
    return () => window.onclick = null
  })

  return (
    <div
      className={`replies-container ${open ? "open" : ""}`}
      key={messageID}
    >
      <div className="replies-header">
        <h3>Replies</h3>
        <ActionIcon
          icon="fal fa-times"
          onClick={onClose}
        />
      </div>
      <div className="replies-list">
        <div className="parent-message">
          {
            message &&
            <MessageItem
              message={message}
              parentMessage
            />
          }
          <div className="reply-label">
            <h6>
              <span>{messageRepliesNum} Repl{messageRepliesNum !== 1 ? 'ies' : 'y'}</span>
              <hr />
            </h6>
          </div>
        </div>
        <div className="replies-list-flex">
          {repliesList}
        </div>
      </div>
      <div className="replies-console">
        <ChatConsole
          inputRef={consoleInputRef}
          inputPlaceholder="Type a reply..."
          value={value}
          onChange={onReplyChange}
          onSendBtnClick={() => {
            handleSendReply()
            setShowReplyConsoleEmojiPicker(false)
          }}
          sendLoading={replyLoading}
          showEmojiPicker={showReplyConsoleEmojiPicker}
          onReactionsClick={(e) => {
            e.stopPropagation()
            setShowReplyConsoleEmojiPicker(prev => !prev)
          }} 
          onFileUploadChange={handleFileUploadChange}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      </div>
      <AppPortal
        showPortal={showReplyEmojiPicker}
        className="emoji-picker-float"
        style={{ position: 'absolute', top: emojiPickerPosition.top, left: emojiPickerPosition.left, zIndex: 1000 }}
      >
        <EmojiPicker
          showPicker
          onEmojiSelect={handleEmojiSelect}
        />
      </AppPortal>
    </div>
  )
}
