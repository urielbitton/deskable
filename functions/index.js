const functions = require("firebase-functions")
const algoliasearch = require('algoliasearch')
const firebase = require("firebase-admin")
firebase.initializeApp()
const db = firebase.firestore()
db.settings({ ignoreUndefinedProperties: true })
const sgMail = require('@sendgrid/mail')

const APP_ID = functions.config().algolia.app
const API_KEY = functions.config().algolia.key

// @ts-ignore
const client = algoliasearch(APP_ID, API_KEY)
const employeesIndex = client.initIndex('employees_index')
const usersIndex = client.initIndex('users_index')


exports.addToIndexUsers = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return usersIndex.saveObject({ ...data, objectID: snapshot.id })
  })

exports.updateIndexUsers = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}').onUpdate((change) => {
    const newData = change.after.data()
    return usersIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexUsers = functions  
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}').onDelete((snapshot, context) => { 
    return usersIndex.deleteObject(snapshot.id)
  })

exports.addToIndexEmployees = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/employees/{employeeID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return updateDB('organizations', data.orgID, {
      employeesIDs: firebaseArrayAdd(data.employeeID),
    })
      .then(() => {
        return employeesIndex.saveObject({ ...data, objectID: snapshot.id })
      })
  })

exports.updateIndexEmployees = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/employees/{employeeID}').onUpdate((change) => {
    const newData = change.after.data()
    return employeesIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexEmployees = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/employees/{employeeID}').onDelete((snapshot, context) => {
    const data = snapshot.data()
    return updateDB('organizations', data.orgID, {
      employeesIDs: firebaseArrayRemove(data.employeeID),
    })
      .then(() => {
        return employeesIndex.deleteObject(snapshot.id)
      })
  })


exports.onCreateProjectTask = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/tasks/{taskID}').onCreate((snapshot, context) => {
    const orgID = context.params.orgID
    const data = snapshot.data()
    return updateDB(`organizations/${orgID}/projects/${data.projectID}/columns`, data.columnID, {
      tasksNum: firebaseIncrement(1),
    })
  })

exports.onDeleteProjectTask = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/tasks/{taskID}').onDelete((snapshot, context) => {
    const orgID = context.params.orgID
    const data = snapshot.data()
    return updateDB(`organizations/${orgID}/projects/${data.projectID}/columns`, data.columnID, {
      tasksNum: firebaseIncrement(-1),
    })
  })

exports.onProjectTaskChange = functions
  .https.onCall((data, context) => {
    return updateDB(`organizations/${data.orgID}/projects/${data.projectID}/columns`, data.newColumnID, {
      tasksNum: firebaseIncrement(1),
    })
      .then(() => {
        return updateDB(`organizations/${data.orgID}/projects/${data.projectID}/columns`, data.oldColumnID, {
          tasksNum: firebaseIncrement(-1),
        })
      })
  })



//utility functions
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