const functions = require("firebase-functions")
const algoliasearch = require('algoliasearch')
const firebase = require("firebase-admin")
const AccessToken = require("twilio").jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
firebase.initializeApp()
const db = firebase.firestore()
const storage = firebase.storage()
db.settings({ ignoreUndefinedProperties: true })
const sgMail = require('@sendgrid/mail')
const twilioAccountSID = functions.config().twilio.sid
const twilioKeySID = functions.config().twilio.keyid
const twilioKeySecret = functions.config().twilio.keysecret
const twilioClient = require('twilio')(
  twilioKeySID,
  twilioKeySecret,
  { accountSid: twilioAccountSID }
)

const APP_ID = functions.config().algolia.app
const API_KEY = functions.config().algolia.key

// @ts-ignore
const client = algoliasearch(APP_ID, API_KEY)
const usersIndex = client.initIndex('users_index')
const projectsIndex = client.initIndex('projects_index')
const tasksIndex = client.initIndex('tasks_index')
const projectPagesIndex = client.initIndex('project_pages_index')
const meetingsIndex = client.initIndex('meetings_index')

//users index
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

//projects index
exports.addToIndexProjects = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return projectsIndex.saveObject({ ...data, objectID: snapshot.id })
  })

exports.updateIndexProjects = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}').onUpdate((change) => {
    const newData = change.after.data()
    return projectsIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexProjects = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}').onDelete((snapshot, context) => {
    return projectsIndex.deleteObject(snapshot.id)
  })

//tasks index
exports.addToIndexProjectTasks = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/tasks/{taskID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return tasksIndex.saveObject({ ...data, objectID: snapshot.id })
  })

exports.updateIndexProjectTasks = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/tasks/{taskID}').onUpdate((change) => {
    const newData = change.after.data()
    return tasksIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexProjectTasks = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/tasks/{taskID}').onDelete((snapshot, context) => {
    return tasksIndex.deleteObject(snapshot.id)
  })

//pages index
exports.addToIndexProjectPages = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/pages/{pageID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return projectPagesIndex.saveObject({ ...data, objectID: snapshot.id })
  })

exports.updateIndexProjectPages = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/pages/{pageID}').onUpdate((change) => {
    const newData = change.after.data()
    return projectPagesIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexProjectPages = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/projects/{projectID}/pages/{pageID}').onDelete((snapshot, context) => {
    return projectPagesIndex.deleteObject(snapshot.id)
  })

//meetings index
exports.addToIndexMeetings = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/meetings/{meetingID}').onCreate((snapshot, context) => { 
    const data = snapshot.data()
    return meetingsIndex.saveObject({ ...data, objectID: snapshot.id })
  })

exports.updateIndexMeetings = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/meetings/{meetingID}').onUpdate((change) => {
    const newData = change.after.data()
    return meetingsIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexMeetings = functions
  .region('northamerica-northeast1')
  .firestore.document('organizations/{orgID}/meetings/{meetingID}').onDelete((snapshot, context) => {
    return meetingsIndex.deleteObject(snapshot.id)
  })



//on triggers
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

exports.onOrgProjectDelete = functions
  .https.onCall((data, context) => {
    const orgID = data.orgID
    const projectID = data.projectID
    const path = `organizations/${orgID}/projects`
    return recursivelyDeleteDocument(path, projectID)
      .then(() => {
        deleteStorageFolder(`organizations/${orgID}/projects/${projectID}`)
      })
      .catch((error) => console.log(error))
  })

exports.onOrgProjectTaskDelete = functions
  .https.onCall((data, context) => {
    const orgID = data.orgID
    const projectID = data.projectID
    const taskID = data.taskID
    const path = `organizations/${orgID}/projects/${projectID}/tasks`
    return recursivelyDeleteDocument(path, taskID)
      .then(() => {
        deleteStorageFolder(`organizations/${orgID}/projects/${projectID}/tasks/${taskID}`)
      })
      .catch((error) => console.log(error))
  })

exports.onOrgPostDelete = functions
  .https.onCall((data, context) => {
    const postID = data.postID
    const pathPrefix = data.pathPrefix
    return recursivelyDeleteDocument(pathPrefix, postID)
      .then(() => {
        deleteStorageFolder(`${pathPrefix}/${postID}`)
      })
      .catch((error) => console.log(error))
  })

exports.uploadHtmlToFirestorage = functions
  .https.onCall((data, context) => {
    const content = data.content
    const path = data.path
    const fileName = data.fileName
    const storageRef = storage.bucket().file(`${path}/${fileName}`)
    return storageRef.save(content, {
      metadata: {
        contentType: 'text/plain',
      },
    })
      .then(() => {
        return storageRef.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        })
          .then((signedURLs) => {
            return signedURLs[0]
          })
      })
  })

exports.recursivelyDeleteDocument = functions
  .https.onCall((data, context) => {
    const path = data.path
    const documentID = data.documentID
    return recursivelyDeleteDocument(path, documentID)
      .catch((error) => console.log(error))
  })



//Twilio API functions

exports.findOrCreateRoom = functions
  .https.onCall((data, context) => {
    const roomName = data.roomName
    const roomType = data.roomType
    const accountType = data.accountType
    twilioClient.video.rooms(roomName).fetch()
    .then((room) => {
      return room
    })
    .catch((error) => {
      if (error.status === 404) {
        twilioClient.video.rooms.create({
          uniqueName: roomName,
          type: roomType,
          maxParticipants: accountType === 'premium' ? 10 : 4
        })
      }
      else {
        console.log(error)
        return error
      }
    })
  })

exports.getRoomAccessToken = functions
  .https.onCall((data, context) => {
    const roomName = data.roomName
    const userID = data.userID
    const token = new AccessToken(
      twilioAccountSID,
      twilioKeySID,
      twilioKeySecret,
      { identity: userID }
    )
    const videoGrant = new VideoGrant({
      room: roomName
    })
    token.addGrant(videoGrant)
    return token.toJwt()
  })


//utility functions
function recursivelyDeleteDocument(path, docID) {
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