const functions = require("firebase-functions")
const firebase = require("firebase-admin")
const db = firebase.firestore()

//utility functions
const recursivelyDeleteDocument = functions
  .https.onCall((data, context) => {
    const path = data.path
    const documentID = data.documentID
    return recursivelyDeleteDoc(path, documentID)
      .catch((error) => console.log(error))
  })
  
function recursivelyDeleteDoc(path, docID) {
  return firebase.firestore().recursiveDelete(firebase.firestore().doc(`${path}/${docID}`))
}

function deleteStorageFolder(path) {
  const bucket = firebase.storage().bucket()
  return bucket.deleteFiles({
    prefix: path
  })
}

function createNotification(userID, title, text, icon, url) {
  const notifPath = `users/${userID}/notifications`
  const docID = getRandomDocID(notifPath)
  return setDB(notifPath, docID, {
    notificationID: docID,
    dateCreated: new Date(),
    isRead: false,
    title: title,
    text: text,
    icon: icon,
    url: url,
  })
}

function formatCurrency(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function getRandomDocID(path) {
  return db.collection(path).doc().id
}

function setDB(path, doc, value, merge = true) {
  return db.collection(path).doc(doc).set(value, { merge })
}

function updateDB(path, doc, value) {
  return db.collection(path).doc(doc).update(value)
}

function deleteDB(path, doc) {
  return db.collection(path).doc(doc).delete()
}

function firebaseArrayAdd(value) {
  return firebase.firestore.FieldValue.arrayUnion(value)
}

function firebaseArrayRemove(value) {
  return firebase.firestore.FieldValue.arrayRemove(value)
}

function firebaseIncrement(value) {
  return firebase.firestore.FieldValue.increment(value)
}

module.exports = {
  recursivelyDeleteDocument,
  recursivelyDeleteDoc,
  deleteStorageFolder,
  createNotification,
  formatCurrency,
  getRandomDocID,
  setDB,
  updateDB,
  deleteDB,
  firebaseArrayAdd,
  firebaseArrayRemove,
  firebaseIncrement,
}