import React, {useContext, useEffect, useState} from 'react'
import './styles/ChatContent.css'
import {StoreContext} from "app/store/store"
import {useParams} from "react-router-dom"
import {useChat, useChatMessages, useGroupChat} from "app/hooks/chatHooks"
import useUser from "app/hooks/userHooks"
import MessageItem from "./MessageItem"

export default function ChatContent() {

  const {myUserID, myOrgID} = useContext(StoreContext)
  const conversationID = useParams().conversationID
  const defaultMsgsLimit = 25
  const [messagesLimit, setMessagesLimit] = useState(defaultMsgsLimit)
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)
  const singleChat = useChat(myUserID, conversationID)
  const groupChat = useGroupChat(myOrgID, conversationID)
  const chat = {...singleChat, ...groupChat}
  const isGroupChat = chat?.type === "group"
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const otherParticipant = useUser(!isGroupChat ? otherParticipantID : null)
  const messages = useChatMessages(myOrgID, conversationID, messagesLimit)
  const hasMessages = messages?.length > 0

  const messagesList = messages?.map(message => {
    return <MessageItem
      key={message.messageID}
      message={message}
      showEmojiPicker={showEmojiPicker}
      setShowEmojiPicker={setShowEmojiPicker}
    />
  })

  const handleSendReply = () => {

  }

  const loadMoreMessages = () => {

  }

  useEffect(() => {
    window.onclick = () => setShowEmojiPicker(null)
    return () => window.onclick = null
  },[])

  return chat ? (
    <div className="chat-content">
      {
        !hasMessages ?
          <div className="new-conversation-info">
            <h4>
              {
                !isGroupChat ?
                  `This is the very beginning of your direct message 
                history with ${otherParticipant?.firstName} ${otherParticipant?.lastName}.`
                  :
                  `This is the very beginning of your group chat ${chat?.name}.`
              }
            </h4>
          </div> :
          <div className="messages-flex">
            {messagesList}
          </div>
      }
    </div>
  ) :
    null
}
