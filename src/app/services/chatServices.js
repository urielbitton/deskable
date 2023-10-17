import {db} from "app/firebase/fire"
import {
  collection, doc, limit, onSnapshot,
  orderBy, query, where
} from "firebase/firestore"
import {getRandomDocID, setDB, updateDB} from "./CrudDB"

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

export const getListOfSingleChatsByUserID = (orgID, userID) => {
  const chatsRef = collection(db, `organizations/${orgID}/conversations`)
  const q = query(
    chatsRef,
    where('type', '==', 'single'),
    where('participantIDs', 'array-contains-any', [userID]),
    where('dateUpdated', '>', new Date(Date.now() - oneMonth)),
    orderBy('dateUpdated', 'desc')
  )
  return q
}

export const getGroupChatByID = (orgID, conversationID) => {
  const chatRef = doc(db, `organizations/${orgID}/conversations`, conversationID)
  return chatRef
}

export const getChatByID = (orgID, conversationID) => {
  const chatRef = doc(db, `organizations/${orgID}/conversations`, conversationID)
  return chatRef
}

export const getMessagesByChatID = (orgID, conversationID, lim) => {
  const messagesRef = collection(db, `organizations/${orgID}/conversations/${conversationID}/messages`)
  const q = query(
    messagesRef,
    where('isDeleted', '==', false),
    orderBy('dateSent', 'desc'),
    limit(lim)
  )
  return q
}

export const getMessageByIDAndChatID = (orgID, conversationID, messageID) => {
  const messageRef = doc(db, `organizations/${orgID}/conversations/${conversationID}/messages`, messageID)
  return messageRef
}

export const getRepliesByChatAndMessageID = (orgID, conversationID, messageID, lim) => {
  const repliesRef = collection(db, `organizations/${orgID}/conversations/${conversationID}/messages/${messageID}/replies`)
  const q = query(
    repliesRef,
    where('isDeleted', '==', false),
    orderBy('dateSent', 'desc'),
    limit(lim)
  )
  return q
}

export const handleSendMessageService = (messageObj) => {
  const {message, user, conversationID, orgID,
    isCombined, hasTimestamp} = messageObj
  const path = `organizations/${orgID}/conversations/${conversationID}/messages`
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    ...message,
    ...user,
    dateModified: null,
    isDeleted: false,
    conversationID,
    messageID: docID,
    isCombined,
    hasTimestamp,
  })
    .then(() => {
      return updateDB(`organizations/${orgID}/conversations/`, conversationID, {
        lastMessage: {
          dateSent: message.dateSent,
          senderID: message.senderID,
          text: message.text,
        },
        lastActive: message.dateSent,
        dateUpdated: new Date()
      })
    })
    .then(() => {
      return {
        success: true,
        messageID: docID,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const handleSendReplyService = (replyObj) => {
  const {message, user, conversationID, orgID, isCombined,
    hasTimestamp, messageID} = replyObj
  const path = `organizations/${orgID}/conversations/${conversationID}/messages/${messageID}/replies`
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    ...message,
    ...user,
    dateModified: null,
    isDeleted: false,
    conversationID,
    replyID: docID,
    messageID,
    isCombined,
    hasTimestamp,
  })
  .then(() => {
    return updateDB(`organizations/${orgID}/conversations/${conversationID}/messages/`, messageID, {
      lastReply: {
        dateSent: message.dateSent,
        senderID: message.senderID,
        text: message.text,
      }
    })
  })
    .then(() => {
      return {
        success: true,
        messageID: docID,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}