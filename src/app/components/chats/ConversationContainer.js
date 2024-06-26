import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatHeader from "./ChatHeader"
import ChatContent from "./ChatContent"
import ChatConsole from "./ChatConsole"
import { hasWhiteSpace } from "app/utils/generalUtils"
import "./styles/ConversationContainer.css"
import { StoreContext } from "app/store/store"
import { Navigate, useParams, useSearchParams } from "react-router-dom"
import { handleSendMessageService, handleSendReplyService, markAsReadService } from "app/services/chatServices"
import { isDateGreaterThanXTimeAgo, isDateLessThanXTimeAgo, isOnSameDay } from "app/utils/dateUtils"
import { useChat, useChatMessage, useMessageReplies } from "app/hooks/chatHooks"
import RepliesContainer from "./RepliesContainer"
import { usePageVisibility } from "app/hooks/generalHooks"
import { uploadMultipleFilesLocal } from "app/utils/fileUtils"

export default function ConversationContainer() {

  const { myUserID, myOrgID, myUserName, myUserImg,
    setToasts } = useContext(StoreContext)
  const conversationID = useParams().conversationID
  const conversation = useChat(myOrgID, conversationID)
  const [messageString, setMessageString] = useState("")
  const [sendLoading, setSendLoading] = useState(false)
  const [replyString, setReplyString] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyContainerOpen, setReplyContainerOpen] = useState(false)
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [repliesUploadedFiles, setRepliesUploadedFiles] = useState([])
  const [uploadFilesLoading, setUploadFilesLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const isPageVisible = usePageVisibility()
  const replyMsgID = searchParams.get("messageID")
  const repliesLimit = 20
  const messageReplies = useMessageReplies(myOrgID, conversationID, replyMsgID, repliesLimit)
  const openMessage = useChatMessage(myOrgID, conversationID, replyMsgID)
  const fiveMinutes = 1000 * 60 * 5
  const fifteenMinutes = 1000 * 60 * 15
  const combineMessage = isDateLessThanXTimeAgo(conversation?.lastMessage?.dateSent?.toDate(), fiveMinutes) && conversation?.lastMessage?.senderID === myUserID
  const combineReply = isDateLessThanXTimeAgo(openMessage?.lastReply?.dateSent?.toDate(), fiveMinutes) && openMessage?.lastReply?.senderID === myUserID
  const insertMsgTimestamp = isDateGreaterThanXTimeAgo(conversation?.lastMessage?.dateSent?.toDate(), fifteenMinutes)
  const insertReplyTimestamp = isDateGreaterThanXTimeAgo(openMessage?.lastReply?.dateSent?.toDate(), fifteenMinutes)
  const hasReadLastMessage = conversation?.isReadBy?.includes(myUserID)
  const consoleInputRef = useRef(null)
  const isNewDay = !isOnSameDay(conversation?.lastMessage?.dateSent?.toDate(), new Date())
  const maxFileSize = 10 * 1024 * 1024
  const maxFilesNum = 10

  const handleSendMessage = () => {
    if (hasWhiteSpace(messageString)) return null
    if(sendLoading) return null
    setSendLoading(true)
    setMessageString("")
    setShowEmojiPicker(false)
    handleSendMessageService({
      message: {
        senderID: myUserID,
        text: messageString,
        dateSent: new Date(),
      },
      files: uploadedFiles,
      user: {
        senderID: myUserID,
        senderName: myUserName,
        senderImg: myUserImg
      },
      conversationID,
      orgID: myOrgID,
      isCombined: isNewDay ? false : combineMessage,
      hasTimestamp: insertMsgTimestamp,
      newDay: isNewDay,
    })
      .then(() => {
        setSendLoading(false)
        setUploadedFiles([])
      })
      .catch(err => {
        setSendLoading(false)
      })
  }

  const handleSendReply = () => {
    if (hasWhiteSpace(replyString)) return null
    if(replyLoading) return null
    setReplyLoading(true)
    setReplyString("")
    handleSendReplyService({
      message: { 
        senderID: myUserID,
        text: replyString,
        dateSent: new Date(),
      },
      files: repliesUploadedFiles,
      user: {
        senderID: myUserID,
        senderName: myUserName,
        senderImg: myUserImg
      },
      conversationID,
      orgID: myOrgID,
      isCombined: combineReply,
      hasTimestamp: insertReplyTimestamp,
      messageID: replyMsgID,
    })
      .then(() => {
        setReplyLoading(false)
        setRepliesUploadedFiles([])
      })
      .catch(err => {
        setReplyLoading(false)
      })
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
    if (searchParams.get("messageID")) {
      setReplyContainerOpen(true)
    }
    else {
      setReplyContainerOpen(false)
    }
  }, [searchParams])

  useEffect(() => {
    if (!hasReadLastMessage) {
      markAsReadService({
        userID: myUserID,
        conversationID,
        orgID: myOrgID
      })
    }
  }, [myOrgID, myUserID, conversationID, isPageVisible])

  useEffect(() => {
    if(!showEmojiPicker || !showReplyEmojiPicker) {
      window.onclick = () => {
        setShowReplyEmojiPicker(false)
        setShowEmojiPicker(false)
      }
      return () => window.onclick = null
    }
  })

  return conversation !== undefined ? (
    <div 
      className="conversation-container"
      key={conversationID}
    >
      <ChatHeader />
      <ChatContent />
      <ChatConsole
        inputRef={consoleInputRef}
        inputPlaceholder="Type a message..."
        value={messageString}
        onChange={(e) => setMessageString(e.target.value)}
        onSendBtnClick={handleSendMessage}
        sendLoading={sendLoading}
        showEmojiPicker={showEmojiPicker}
        onReactionsClick={(e) => {
          e.stopPropagation()
          setShowEmojiPicker(prev => !prev)
        }}
        onFileUploadChange={handleFileUploadChange}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />
      <RepliesContainer
        replies={messageReplies}
        onReplyChange={(e) => setReplyString(e.target.value)}
        value={replyString}
        handleSendReply={handleSendReply}
        open={replyContainerOpen}
        onClose={() => setSearchParams({})}
        replyLoading={replyLoading}
        showReplyEmojiPicker={showReplyEmojiPicker}
        setShowReplyEmojiPicker={setShowReplyEmojiPicker}
        uploadedFiles={repliesUploadedFiles}
        setUploadedFiles={setRepliesUploadedFiles}
      />
    </div>
  ) :
  (conversation === null || conversation !== undefined) ? null :
  <Navigate to="/messages/not-found" />
}
