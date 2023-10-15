import { db } from "app/firebase/fire"
import { collection, doc, onSnapshot, 
  orderBy, query, where 
} from "firebase/firestore"

const oneMonth = 1000 * 60 * 60 * 24 * 30 

export const getListOfGroupChatsByOrgID = (orgID) => {
  const chatsRef = collection(db, `organizations/${orgID}/conversations`)
  const q = query(
    chatsRef,
    where('type', '==', 'group'),
    where('dateUpdated', '>', new Date(Date.now() - oneMonth)),
    orderBy('dateUpdated', 'desc')
  )
  return q
}

export const getListOfSingleChatsByUserID = (userID) => {
  const chatsRef = collection(db, `users/${userID}/conversations`)
  const q = query(
    chatsRef,
    where('type', '==', 'single'),
    where('dateUpdated', '>', new Date(Date.now() - oneMonth)),
    orderBy('dateUpdated', 'desc')
  )
  return q
}

export const getGroupChatByID = (orgID, chatID, setChat) => {
  const chatRef = doc(db, `organization/${orgID}/conversations`, chatID)
  onSnapshot(chatRef, snapshot => {
    setChat(snapshot.data())
  })
} 

export const getChatByID = (userID, chatID, setChat) => {
  const chatRef = doc(db, `users/${userID}/conversations`, chatID)
  onSnapshot(chatRef, snapshot => {
    setChat(snapshot.data())
  })
}