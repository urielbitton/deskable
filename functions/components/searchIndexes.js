const functions = require("firebase-functions")
const algoliasearch = require('algoliasearch')

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