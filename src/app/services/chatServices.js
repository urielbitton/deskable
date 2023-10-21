import { db } from "app/firebase/fire"
import {
  collection, doc, limit,
  orderBy, query, where
} from "firebase/firestore"
import {
  deleteDB, firebaseArrayAdd,
  firebaseIncrement, getRandomDocID,
  setDB, updateDB
} from "./CrudDB"

const oneYear = 1000 * 60 * 60 * 24 * 365

export const getListOfSpaceChatsByOrgID = (orgID, userID) => {
  const chatsRef = collection(db, `organizations/${orgID}/conversations`)
  const q = query(
    chatsRef,
    where('type', '==', 'space'),
    where('participantsIDs', 'array-contains', userID),
    where('dateUpdated', '>', new Date(Date.now() - oneYear)),
    orderBy('dateUpdated', 'desc')
  )
  return q
}

export const getListOfSingleChatsByUserID = (orgID, userID) => {
  const chatsRef = collection(db, `organizations/${orgID}/conversations`)
  const q = query(
    chatsRef,
    where('type', '==', 'single'),
    where('participantsIDs', 'array-contains', userID),
    where('dateUpdated', '>', new Date(Date.now() - oneYear)),
    orderBy('dateUpdated', 'desc')
  )
  return q
}

export const getSpaceChatByID = (orgID, conversationID) => {
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
  const { message, user, conversationID, orgID,
    isCombined, hasTimestamp, newDay } = messageObj
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
    newDay
  })
    .then(() => {
      return updateDB(`organizations/${orgID}/conversations/`, conversationID, {
        lastMessage: {
          dateSent: message.dateSent,
          senderID: message.senderID,
          text: message.text,
        },
        lastActive: message.dateSent,
        dateUpdated: new Date(),
        isReadBy: [user.senderID]
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
  const { message, user, conversationID, orgID, isCombined,
    hasTimestamp, messageID } = replyObj
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
      return updateDB(`organizations/${orgID}/conversations/${conversationID}/messages`, messageID, {
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

export const markAsReadService = (readObj) => {
  const { userID, conversationID, orgID } = readObj
  return updateDB(`organizations/${orgID}/conversations/`, conversationID, {
    isReadBy: firebaseArrayAdd(userID)
  })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const addEmojiReactionService = (emojiObj, path) => {
  const { emoji, userID, userName, userImg } = emojiObj
  const docID = emoji.shortcodes
  return setDB(path, docID, {
    reactionID: docID,
    emoji,
    users: [{
      userID,
      userName,
      userImg,
    }],
    dateAdded: new Date(),
    reactionCount: 1
  })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

//emoji reaction clicks service function
export const handleReactionClickService = (reactionMeta, userMeta, messagePath) => {
  const isAReactor = reactionMeta?.reactionUsers?.findIndex(user => user.userID === userMeta?.userID) > -1
  if (!isAReactor) {
    return updateEmojiReactionService(
      {
        emoji: reactionMeta?.emoji,
        reactionUsers: reactionMeta?.reactionUsers
      },
      {
        userID: userMeta?.userID,
        userName: userMeta?.userName,
        userImg: userMeta?.userImg,
      },
      messagePath
    )
  }
  return removeEmojiReactionService(
    {
      emoji: reactionMeta?.emoji,
      reactionUsers: reactionMeta?.reactionUsers
    },
    {
      userID: userMeta?.userID,
    },
    messagePath
  )
}

export const updateEmojiReactionService = (reactionMeta, userMeta, path) => {
  const docID = reactionMeta?.emoji.shortcodes
  return updateDB(path, docID, {
    users: firebaseArrayAdd({
      ...userMeta
    }),
    reactionCount: firebaseIncrement(1)
  })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const removeEmojiReactionService = (reactionMeta, userMeta, path) => {
  const docID = reactionMeta.emoji.shortcodes
  const isOnlyReactor = reactionMeta?.reactionUsers.length === 1
    && reactionMeta?.reactionUsers[0]?.userID === userMeta?.userID
  if (isOnlyReactor) {
    return deleteDB(path, docID)
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return updateDB(path, docID, {
    users: reactionMeta.reactionUsers?.filter(user => user.userID !== userMeta.userID),
    reactionCount: firebaseIncrement(-1)
  })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getReactionsByMessageAndChatID = (orgID, conversationID, messageID) => {
  const reactionsRef = collection(db, `organizations/${orgID}/conversations/${conversationID}/messages/${messageID}/reactions`)
  const q = query(
    reactionsRef,
  )
  return q
}

export const getReactionsByReplyAndMessageID = (orgID, conversationID, messageID, replyID) => {
  const reactionsRef = collection(db, `organizations/${orgID}/conversations/${conversationID}/messages/${messageID}/replies/${replyID}/reactions`)
  const q = query(
    reactionsRef,
  )
  return q
}

//create space & single conversation
export const createConversationService = (data) => {
  const { selectedUsersIDs, spaceName, messageMeta, userMeta,
    orgID, participantID, isSpaceChat } = data
  const path = `organizations/${orgID}/conversations`
  const docID = getRandomDocID(path)
  const messagesPath = `organizations/${orgID}/conversations/${docID}/messages`
  return setDB(path, docID, {
    ...(isSpaceChat && { blockedIDs: [] }),
    conversationID: docID,
    creatorID: userMeta.userID,
    dateUpdated: new Date(),
    isArchived: false,
    isDeleted: false,
    isReadBy: [userMeta.userID],
    lastActive: new Date(),
    lastMessage: { ...messageMeta },
    ...(isSpaceChat && { notifiedUsersIDs: selectedUsersIDs }),
    orgID,
    ...(!isSpaceChat && { participantID }),
    ...(isSpaceChat ? { participantsIDs: [...selectedUsersIDs, userMeta.userID] } : { participantsIDs: [participantID, userMeta.userID] }),
    ...(isSpaceChat && { spaceName }),
    type: isSpaceChat ? 'space' : 'single',
    usersTyping: []
  })
    .then(() => {
      const messageID = getRandomDocID(messagesPath)
      return setDB(messagesPath, messageID, {
        conversationID: docID,
        dateModified: null,
        dateSent: messageMeta.dateSent,
        isCombined: false,
        isDeleted: false,
        messageID,
        senderID: userMeta.userID,
        senderName: userMeta.userName,
        senderImg: userMeta.userImg,
        text: messageMeta.text,
      })
    })
    .then(() => {
      return {
        success: true,
        conversationID: docID,
      }
    })
    .catch((err) => {
      console.log(err)
      return {
        success: false,
        conversationID: null,
      }
    })
}

//save edited message
export const saveEditedMessageService = (data) => {
  const { text, messageID, conversationID, orgID } = data
  const path = `organizations/${orgID}/conversations/${conversationID}/messages`
  return updateDB(path, messageID, {
    text,
    dateModified: new Date(),
  })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err) => {
      console.log(err)
      return {
        success: false,
      }
    })
}

export const saveEditedReplyService = (data) => {
  const { text, messageID, replyID, conversationID, orgID } = data
  const path = `organizations/${orgID}/conversations/${conversationID}/messages/${messageID}/replies`
  return updateDB(path, replyID, {
    text,
    dateModified: new Date(),
  })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err) => {
      console.log(err)
      return {
        success: false,
      }
    })
}