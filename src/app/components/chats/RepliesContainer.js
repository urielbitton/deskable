import React, { useContext, useState } from 'react'
import ChatConsole, { ActionIcon } from "./ChatConsole"
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

export default function RepliesContainer(props) {

  const { myOrgID } = useContext(StoreContext)
  const { replies, replyString, onReplyChange, value,
    handleSendReply, replyLoading, open, onClose,
    showReplyEmojiPicker, setShowReplyEmojiPicker } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: '0', left: '0' })
  const screenHeight = useScreenHeight()
  const conversationID = useParams().conversationID
  const messageID = searchParams.get('messageID')
  const messagePath = `organizations/${myOrgID}/conversations/${conversationID}/messages/${messageID}/replies`
  const message = useChatMessage(myOrgID, conversationID, messageID)
  const messageRepliesNum = useDocsCount(messagePath, messageID)

  const repliesList = replies?.map(reply => {
    return <ReplyItem
      key={reply.replyID}
      reply={reply}
      showReplyEmojiPicker={showReplyEmojiPicker}
      setShowReplyEmojiPicker={setShowReplyEmojiPicker}
    />
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
          inputPlaceholder="Type a reply..."
          value={value}
          onChange={onReplyChange}
          onSendBtnClick={handleSendReply}
          sendLoading={replyLoading}
          showEmojiPicker={showReplyEmojiPicker}
          onReactionsClick={(e) => {
            e.stopPropagation()
            showReplyEmojiPicker(prev => !prev)
          }}
        />
      </div>
    </div>
  )
}
