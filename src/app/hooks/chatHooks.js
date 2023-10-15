import { getChatByID, getGroupChatByID, getListOfGroupChatsByOrgID, 
  getListOfSingleChatsByUserID } from "app/services/chatServices"
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

export const useGroupChat = (orgID, chatID) => {

  const [chat, setChat] = useState(null)

  useEffect(() => {
    if(!chatID || !orgID) return setChat(null)
    getGroupChatByID(orgID, chatID, setChat)
  }, [orgID, chatID])

  return chat
}

export const useChat = (userID, chatID) => {

  const [chat, setChat] = useState(null)

  useEffect(() => {
    if(!chatID || !userID) return setChat(null)
    getChatByID(userID, chatID, setChat)
  }, [userID, chatID])

  return chat
}