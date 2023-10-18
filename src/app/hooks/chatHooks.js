import {
  getChatByID, getGroupChatByID, getListOfGroupChatsByOrgID,
  getListOfSingleChatsByUserID,
  getMessageByIDAndChatID,
  getMessagesByChatID,
  getReactionsByMessageAndChatID,
  getReactionsByReplyAndMessageID,
  getRepliesByChatAndMessageID
} from "app/services/chatServices"
import { onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

export const useListOfGroupChats = (orgID) => {

  const [messages, setMessages] = useState([])

  useEffect(() => {
    const q = getListOfGroupChatsByOrgID(orgID)
    onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()))
    })
  }, [orgID])

  return messages
}

export const useListOfSingleChats = (orgID, userID) => {

  const [messages, setMessages] = useState([])

  useEffect(() => {
    const q = getListOfSingleChatsByUserID(orgID, userID)
    onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()))
    })
  }, [orgID])

  return messages
}

export const useGroupChat = (orgID, conversationID) => {

  const [chat, setChat] = useState(null)

  useEffect(() => {
    if (!conversationID || !orgID) return setChat(null)
    const ref = getGroupChatByID(orgID, conversationID)
    onSnapshot(ref, (snapshot) => {
      setChat(snapshot.data())
    })
  }, [orgID, conversationID])

  return chat
}

export const useChat = (orgID, conversationID) => {

  const [chat, setChat] = useState(null)

  useEffect(() => {
    if (!conversationID || !orgID) return setChat(null)
    const ref = getChatByID(orgID, conversationID)
    onSnapshot(ref, (snapshot) => {
      setChat(snapshot.data())
    })
  }, [orgID, conversationID])

  return chat
}

export const useChatMessages = (orgID, conversationID, limit) => {

  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!orgID || !conversationID) return setMessages([])
    const q = getMessagesByChatID(orgID, conversationID, limit)
    onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()))
    })
  }, [orgID, conversationID, limit])

  return messages
}

export const useChatMessage = (orgID, conversationID, messageID) => {

  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!orgID || !conversationID || !messageID) return setMessage(null)
    const ref = getMessageByIDAndChatID(orgID, conversationID, messageID)
    onSnapshot(ref, (snapshot) => {
      setMessage(snapshot.data())
    })
  }, [orgID, conversationID, messageID])

  return message
}

export const useMessageReplies = (orgID, conversationID, messageID, limit) => {

  const [replies, setReplies] = useState([])

  useEffect(() => {
    if (!orgID || !conversationID || !messageID) return setReplies([])
    const q = getRepliesByChatAndMessageID(orgID, conversationID, messageID, limit)
    onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs.map(doc => doc.data()))
    })
  }, [orgID, conversationID, messageID, limit])

  return replies
}

export const useMessageReactions = (orgID, conversationID, messageID) => {

  const [reactions, setReactions] = useState([])

  useEffect(() => {
    if (!orgID || !conversationID || !messageID) return setReactions([])
    const q = getReactionsByMessageAndChatID(orgID, conversationID, messageID)
    onSnapshot(q, (snapshot) => {
      setReactions(snapshot.docs.map(doc => doc.data()))
    })
  }, [orgID, conversationID, messageID])
  return reactions
}

export const useReplyReactions = (orgID, conversationID, messageID, replyID) => {

  const [reactions, setReactions] = useState([])

  useEffect(() => {
    if (!orgID || !conversationID || !messageID || !replyID) return setReactions([])
    const q = getReactionsByReplyAndMessageID(orgID, conversationID, messageID, replyID)
    onSnapshot(q, (snapshot) => {
      setReactions(snapshot.docs.map(doc => doc.data()))
    })
  }, [orgID, conversationID, messageID, replyID])
  return reactions
}