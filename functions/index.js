const firebase = require("firebase-admin")
firebase.initializeApp()
const db = firebase.firestore()
db.settings({ ignoreUndefinedProperties: true })


//module imports
const { sendEmailWithAttachment } = require('./components/emails')
const { recursivelyDeleteDocument } = require("./components/utilities")
const { findOrCreateRoom, getRoomAccessToken } = require("./components/twilio")
const { onCreateProjectTask, onDeleteProjectTask, 
  onProjectTaskChange, onOrgProjectDelete, 
  onOrgProjectTaskDelete, onOrgPostDelete,
  uploadHtmlToFirestorage } = require("./components/firebaseTriggers")
const { addToIndexUsers, updateIndexUsers, deleteFromIndexUsers,
  addToIndexProjects, updateIndexProjects, deleteFromIndexProjects,
  addToIndexProjectTasks, updateIndexProjectTasks, deleteFromIndexProjectTasks,
  addToIndexProjectPages, updateIndexProjectPages, deleteFromIndexProjectPages,
  addToIndexMeetings, updateIndexMeetings, deleteFromIndexMeetings } = require("./components/searchIndexes")



//email module imports 
exports.sendEmailWithAttachment = sendEmailWithAttachment

//utilities module imports
exports.recursivelyDeleteDocument = recursivelyDeleteDocument

//twilio module imports
exports.findOrCreateRoom = findOrCreateRoom
exports.getRoomAccessToken = getRoomAccessToken

//firebase triggers module imports
exports.onCreateProjectTask = onCreateProjectTask
exports.onDeleteProjectTask = onDeleteProjectTask
exports.onProjectTaskChange = onProjectTaskChange
exports.onOrgProjectDelete = onOrgProjectDelete
exports.onOrgProjectTaskDelete = onOrgProjectTaskDelete
exports.onOrgPostDelete = onOrgPostDelete
exports.uploadHtmlToFirestorage = uploadHtmlToFirestorage

//search indexes module imports
exports.addToIndexUsers = addToIndexUsers
exports.updateIndexUsers = updateIndexUsers
exports.deleteFromIndexUsers = deleteFromIndexUsers
exports.addToIndexProjects = addToIndexProjects
exports.updateIndexProjects = updateIndexProjects
exports.deleteFromIndexProjects = deleteFromIndexProjects
exports.addToIndexProjectTasks = addToIndexProjectTasks
exports.updateIndexProjectTasks = updateIndexProjectTasks
exports.deleteFromIndexProjectTasks = deleteFromIndexProjectTasks
exports.addToIndexProjectPages = addToIndexProjectPages
exports.updateIndexProjectPages = updateIndexProjectPages
exports.deleteFromIndexProjectPages = deleteFromIndexProjectPages
exports.addToIndexMeetings = addToIndexMeetings
exports.updateIndexMeetings = updateIndexMeetings
exports.deleteFromIndexMeetings = deleteFromIndexMeetings



