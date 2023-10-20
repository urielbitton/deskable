import React, { useContext, useEffect, useRef, 
  useState, useMemo } from 'react'
import './styles/ChatContent.css'
import { StoreContext } from "app/store/store"
import { useParams } from "react-router-dom"
import { useChat, useChatMessages, useSpaceChat } from "app/hooks/chatHooks"
import useUser, { useDocsCount } from "app/hooks/userHooks"
import MessageItem from "./MessageItem"
import { useInViewport } from "app/hooks/generalHooks"

export default function ChatContent() {

  const { myUserID, myOrgID } = useContext(StoreContext)
  const conversationID = useParams().conversationID
  const defaultMsgsLimit = 30
  const [messagesLimit, setMessagesLimit] = useState(defaultMsgsLimit)
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)
  const singleChat = useChat(myUserID, conversationID)
  const spaceChat = useSpaceChat(myOrgID, conversationID)
  const chat = { ...singleChat, ...spaceChat }
  const lastMessage = chat?.lastMessage
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const isSpaceChat = chat?.type === "space"
  const loadNewRef = useRef(null)
  const messagesListRef = useRef(null)
  const otherParticipant = useUser(!isSpaceChat ? otherParticipantID : lastMessage?.senderID)
  const messages = useChatMessages(myOrgID, conversationID, messagesLimit)
  const chatMessagesNum = useDocsCount(`organizations/${myOrgID}/conversations/${conversationID}/messages`, lastMessage)
  const hasMessages = messages?.length > 0
  const viewPortOffset = 50
  const inView = useInViewport(loadNewRef, messagesListRef, viewPortOffset)

  const messagesList = useMemo(() => {
    return messages?.map((message) => (
      <MessageItem
        key={message.messageID}
        message={message}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
      />
    ))
  }, [messages, chat])

  const handleSendReply = () => {

  }

  const loadMoreMessages = () => {

  }

  const handleOnScroll = () => {
    if (inView) {
      setMessagesLimit(prev => prev + defaultMsgsLimit)
    }
  }

  useEffect(() => {
    window.onclick = () => setShowEmojiPicker(null)
    return () => window.onclick = null
  })

  return chat ? (
    <div
      className="chat-content"
      key={chat?.conversationID}
    >
      {
        !hasMessages ?
          <div className="new-conversation-info">
            <h4>
              {
                !isSpaceChat ?
                  `This is the very beginning of your direct message 
                history with ${otherParticipant?.firstName} ${otherParticipant?.lastName}.`
                  :
                  `This is the very beginning of your space ${chat?.name}.`
              }
            </h4>
          </div> :
          <div
            className="messages-flex"
            ref={messagesListRef}
            onScroll={handleOnScroll}
          >
            {messagesList}
            {
              chatMessagesNum > messagesLimit &&
              <div
                className="load-new"
                ref={loadNewRef}
              >
                <i className="fas fa-spinner fa-spin" />
                <small>Loading messages</small>
              </div>
            }
          </div>
      }
    </div>
  ) : null
}
