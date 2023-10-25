const functions = require("firebase-functions")
const firebase = require("firebase-admin")
const { updateDB, firebaseIncrement, 
  deleteStorageFolder, recursivelyDeleteDoc } = require("./utilities")
const storage = firebase.storage()

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
    return recursivelyDeleteDoc(path, projectID)
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
    return recursivelyDeleteDoc(path, taskID)
      .then(() => {
        deleteStorageFolder(`organizations/${orgID}/projects/${projectID}/tasks/${taskID}`)
      })
      .catch((error) => console.log(error))
  })

exports.onOrgPostDelete = functions
  .https.onCall((data, context) => {
    const postID = data.postID
    const pathPrefix = data.pathPrefix
    return recursivelyDeleteDoc(pathPrefix, postID)
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