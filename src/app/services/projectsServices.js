import { errorToast, successToast } from "app/data/toastsTemplates"
import { db, functions } from "app/firebase/fire"
import {
  collection, collectionGroup, doc, getDocs, limit,
  onSnapshot, orderBy, query, runTransaction, where, writeBatch
} from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import {
  deleteDB, firebaseArrayAdd, firebaseArrayRemove,
  firebaseIncrement, getDocsCount, getRandomDocID,
  setDB, updateDB
} from "./CrudDB"
import { createNotification } from "./notifServices"
import {
  deleteMultipleStorageFiles,
  uploadMultipleFilesToFireStorage
} from "./storageServices"

//db reads

export const getProjectsByOrgID = (orgID, myUserID, setProjects, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects`)
  const q = query(
    docRef,
    where('members', 'array-contains', myUserID),
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setProjects(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectByID = (orgID, projectID, setProject) => {
  const docRef = doc(db, `organizations/${orgID}/projects`, projectID)
  onSnapshot(docRef, (doc) => {
    setProject(doc.data())
  })
}

export const getOrgProjectTasks = (orgID, projectID, setTasks, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    orderBy('position', 'asc'),
    orderBy('title', 'asc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTaskByID = (orgID, projectID, taskID, setTask) => {
  const docRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  onSnapshot(docRef, (doc) => {
    setTask(doc.data())
  })
}

export const getOrgProjectColumns = (orgID, projectID, setColumns) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/columns`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'asc')
  )
  onSnapshot(q, (snapshot) => {
    setColumns(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectColumnByID = (orgID, projectID, columnID, setColumn) => {
  const docRef = doc(db, `organizations/${orgID}/projects/${projectID}/columns`, columnID)
  onSnapshot(docRef, (doc) => {
    setColumn(doc.data())
  })
}

export const getOrgProjectFirstColumn = (orgID, projectID) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/columns`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'asc'),
    limit(1)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map(doc => doc.data())[0]
    })
}

export const getOrgProjectLastColumn = (orgID, projectID) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/columns`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(1)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map(doc => doc.data())[0]
    })
}

export const getOrgProjectTasksByColumnID = (orgID, projectID, columnID, setTasks) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    orderBy('position', 'asc'),
    where('columnID', '==', columnID)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTasksByColumnsArray = (orgID, projectID, columns, setTasks) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    orderBy('position', 'asc'),
    where('columnID', 'in', columns.map(column => column.columnID)),
    where('inSprint', '==', true)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTaskFiles = (orgID, projectID, taskID, setFiles, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/files`)
  const q = query(
    docRef,
    orderBy('dateUploaded', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setFiles(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTaskComments = (orgID, projectID, taskID, setComments, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/comments`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setComments(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTaskEvents = (orgID, projectID, taskID, setEvents, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/events`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setEvents(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectOpenTasks = (orgID, projectID, setTasks, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    where('isDone', '==', false),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectClosedTasks = (orgID, projectID, setTasks, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    where('isDone', '==', true),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getLastMonthOrgOpenProjectTasks = (orgID, isDone, setTasks, lim) => {
  const docRef = collectionGroup(db, 'tasks')
  const q = query(
    docRef,
    where('dateModified', '>=', new Date(new Date().setMonth(new Date().getMonth() - 1))),
    where('isDone', '==', isDone),
    where('orgID', '==', orgID),
    orderBy('dateModified', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTasksBySprintID = (orgID, projectID, sprintID, setTasks) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    orderBy('backlogPosition', 'asc'),
    where('sprintID', '==', sprintID),
    where('inSprint', '==', true)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTasksInBacklog = (orgID, projectID, setTasks) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    orderBy('backlogPosition', 'asc'),
    where('inSprint', '==', false),
    where('status', '==', 'backlog')
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectPages = (orgID, projectID, setPages, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/pages`)
  const q = query(
    docRef,
    where('isPublished', '==', true),
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setPages(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectPageByID = (orgID, projectID, pageID, setPage) => {
  const docRef = doc(db, `organizations/${orgID}/projects/${projectID}/pages`, pageID)
  onSnapshot(docRef, (doc) => {
    setPage(doc.data())
  })
}


//db writes

export const catchCode = (err, errorText, setToasts, setLoading) => {
  console.log(err)
  setLoading && setLoading(false)
  setToasts && setToasts(errorToast(errorText, true))
}

export const createOrgProjectService = (orgID, userID, project, setToasts, setLoading) => {
  setLoading(true)
  const path = `organizations/${orgID}/projects`
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    ...project,
    activeSprintID: 'init',
    admins: [userID],
    dateCreated: new Date(),
    description: '',
    isActive: true,
    isStarred: false,
    isSprintActive: false,
    isCompleted: false,
    invitations: [],
    lastActive: new Date(),
    orgID,
    ownerID: userID,
    projectID: docID,
    projectKey: project.name.slice(0, 3).toUpperCase(),
    sprintName: 'Sprint Planning',
    sprintNumber: 0,
  })
    .then(() => {
      const columnsPath = `organizations/${orgID}/projects/${docID}/columns`
      const columnID = getRandomDocID(path)
      return setDB(columnsPath, columnID, {
        columnID,
        dateCreated: new Date(),
        isActive: true,
        projectID: docID,
        tasksNum: 0,
        title: 'To Do'
      })
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Project was successfully created.'))
      return docID
    })
    .catch(err => catchCode(err, 'There was an error creating the project. Please try again', setToasts, setLoading))
}

export const updateOrgProjectService = (orgID, projectID, project, setToasts, setLoading) => {
  const path = `organizations/${orgID}/projects`
  return updateDB(path, projectID, {
    ...project,
  })
    .then(() => {
      setLoading(false)
    })
    .catch(err => catchCode(err, 'There was an error updating the project. Please try again', setToasts, setLoading))
}

export const deleteOrgProjectService = (orgID, projectID, projectName, setToasts, setLoading) => {
  return httpsCallable(functions, 'onOrgProjectDelete')({
    orgID, projectID
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast(`Project ${projectName} was successfully deleted.`))
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast('There was a problem while trying to delete the project. Please try again.'))
      setLoading(false)
    })
}

export const renameBoardColumnService = (orgID, projectID, columnID, title, setToasts) => {
  const path = `organizations/${orgID}/projects/${projectID}/columns`
  return updateDB(path, columnID, {
    title
  })
    .then(() => {
      setToasts(successToast('Column title updated successfully.'))
    })
    .catch(err => catchCode(err, 'There was an error updating the column title. Please try again', setToasts))
}

export const createProjectColumnService = (orgID, projectID, title, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/projects/${projectID}/columns`
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    columnID: docID,
    title,
    dateCreated: new Date(),
    isActive: true,
    projectID,
    tasksNum: 0,
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Column created successfully.'))
    })
    .catch(err => catchCode(err, 'There was a problem creating the column. Please try again.', setToasts, setLoading))
}

export const deleteProjectColumnService = (columnsPath, columnID, setLoading, setToasts) => {
  setLoading(true)
  return deleteDB(columnsPath, columnID)
    .then(() => {
      setLoading(false)
      setToasts(successToast('Column deleted successfully.'))
    })
    .catch(err => catchCode(err, 'There was a problem deleting the column. Please try again.', setToasts, setLoading))
}

export const createProjectTaskService = (orgID, userID, project, columnID, task, taskNum, files, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/projects/${project.projectID}/tasks`
  const docID = getRandomDocID(path)
  const storagePath = `organizations/${orgID}/projects/${project.projectID}/tasks/${docID}/files`
  return uploadMultipleFilesToFireStorage(files, storagePath, null, null)
    .then((uploadedFiles) => {
      return setDB(path, docID, {
        assigneesIDs: task.assigneesIDs,
        backlogPosition: null,
        columnID,
        creatorID: userID,
        dateCreated: new Date(),
        dateModified: new Date(),
        description: task.description,
        inSprint: task.addTo === 'sprint',
        inDone: false,
        orgID,
        position: task.position,
        priority: task.priority,
        projectID: project.projectID,
        points: +task.points || 0,
        reporterID: task.reporter,
        sprintID: project?.activeSprintID || null,
        status: task.addTo === 'backlog' ? 'backlog' : task.status,
        taskID: docID,
        taskNum: `${project?.name?.slice(0, 3)?.toUpperCase()}-${taskNum < 10 ? '0' : ''}${taskNum || ''}`,
        taskType: task.taskType,
        title: task.taskTitle
      })
        .then(() => {
          if (!uploadedFiles.length) {
            return Promise.resolve()
          }
          const batch = writeBatch(db)
          uploadedFiles.forEach(file => {
            const filesPath = `organizations/${orgID}/projects/${project.projectID}/tasks/${docID}/files`
            const filesDocID = getRandomDocID(filesPath)
            const fileRef = doc(db, filesPath, filesDocID)
            batch.set(fileRef, {
              dateUploaded: new Date(),
              fileID: filesDocID,
              name: file.file.name,
              projectID: project.projectID,
              size: file.file.size,
              taskID: docID,
              type: file.file.type,
              url: file.downloadURL
            })
          })
          return batch.commit()
        })
        .catch(err => catchCode(err, 'There was a problem creating the task. Please try again.', setToasts, setLoading))
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast(`Task created successfully. ${task.addTo === 'sprint' ? 'Adding to sprint...' : ''}`))
    })
    .catch(err => catchCode(err, 'There was a problem creating the task. Please try again.', setToasts, setLoading))
}

export const updateSingleTaskItemService = (tasksPath, taskID, item, setToasts) => {
  return updateDB(tasksPath, taskID, {
    ...item,
    dateModified: new Date()
  })
    .catch(err => catchCode(err, 'There was a problem updating the task. Please try again.', setToasts))
}

export const deleteProjectTaskService = (path, taskID, setLoading, setToasts) => {
  setLoading(true)
  const orgID = path.split('/')[1]
  const projectID = path.split('/')[3]
  const taskRef = doc(db, path, taskID)
  const batch = writeBatch(db)
  return runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const columnID = snapshot.data().columnID
        const position = snapshot.data().position
        const colRef = collection(db, path)
        const q = query(
          colRef,
          where('columnID', '==', columnID),
          where('position', '>', position)
        )
        return getDocs(q)
          .then(snapshot => {
            snapshot.forEach((snap) => {
              const docID = snap.id
              batch.update(doc(db, path, docID), {
                position: firebaseIncrement(-1)
              })
            })
          })
      })
  })
    .then(() => {
      return httpsCallable(functions, 'onOrgProjectTaskDelete')({
        orgID, projectID, taskID
      })
    })
    .then(() => {
      return batch.commit()
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Task deleted successfully.'))
    })
    .catch(err => catchCode(err, 'There was a problem deleting the task. Please try again.', setToasts, setLoading))
}

export const getLastColumnTaskPosition = (orgID, projectID, columnID) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    where('columnID', '==', columnID),
    orderBy('position', 'desc'),
    limit(1)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map(doc => doc.data().position)[0] || -1
    })
    .catch(err => console.log(err))
}

export const getLastBacklogTaskPosition = (orgID, projectID) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    where('inSprint', '==', false),
    orderBy('backlogPosition', 'desc'),
    limit(1)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map(doc => doc.data().backlogPosition)[0] || -1
    })
    .catch(err => console.log(err))
}

export const getLastSprintTaskPosition = (orgID, projectID, sprintID) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    where('inSprint', '==', true),
    orderBy('backlogPosition', 'desc'),
    limit(1)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map(doc => doc.data().backlogPosition)[0] || -1
    })
    .catch(err => console.log(err))
}

export const changeSameColumnTaskPositionService = (orgID, projectID, task, newPosition, setToasts) => {
  const taskID = task.taskID
  const columnID = task.columnID
  const oldPosition = task.position
  const taskRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  const batch = writeBatch(db)
  return runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const path = `organizations/${orgID}/projects/${projectID}/tasks`
        const q = query(
          collection(db, path),
          where('columnID', '==', columnID),
          where('position', '>=', Math.min(oldPosition, newPosition)),
          where('position', '<=', Math.max(oldPosition, newPosition))
        )
        return getDocs(q)
          .then(snapshot => {
            snapshot.forEach((snap) => {
              const data = snap.data()
              const docID = snap.id
              const notItself = data.taskID !== taskID
              if (data.columnID === columnID) {
                if (data.position < newPosition && notItself) {
                  batch.update(doc(db, path, docID), {
                    position: firebaseIncrement(-1)
                  })
                }
                if (data.position > newPosition && notItself) {
                  batch.update(doc(db, path, docID), {
                    position: firebaseIncrement(1)
                  })
                }
                if (data.position === newPosition && notItself) {
                  batch.update(doc(db, path, docID), {
                    position: firebaseIncrement(data.position < oldPosition ? 1 : -1)
                  })
                }
                batch.update(doc(db, path, taskID), {
                  position: newPosition
                })
              }
            })
          })
      })
  })
    .then(() => {
      return batch.commit()
        .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts))
    })
    .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts))
}

export const changeDiffColumnTaskPositionService = (orgID, projectID, task, newPosition, oldColumnID,
  newColumnID, columns, setToasts) => {
  const newColumnTitle = columns.filter(column => column.columnID === newColumnID)[0].title
  const taskID = task.taskID
  const columnID = task.columnID
  const oldPosition = task.position
  const taskRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  const batch = writeBatch(db)
  return runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const path = `organizations/${orgID}/projects/${projectID}/tasks`
        const colRef = collection(db, path)
        const q = query(colRef)
        return getDocs(q)
          .then(snapshot => {
            snapshot.forEach((snap) => {
              const data = snap.data()
              const docID = snap.id
              if (data.columnID === columnID) {
                if (data.position > oldPosition) {
                  batch.update(doc(db, path, docID), {
                    position: firebaseIncrement(-1)
                  })
                }
              }
              if (data.columnID === newColumnID) {
                if (data.position >= newPosition) {
                  batch.update(doc(db, path, docID), {
                    position: firebaseIncrement(1)
                  })
                }
              }
              if (data.taskID === taskID) {
                batch.update(doc(db, path, docID), {
                  position: newPosition,
                  columnID: newColumnID,
                  status: newColumnTitle,
                  isDone: newColumnID === columns[columns.length - 1].columnID && newColumnID !== columns[0].columnID
                })
              }
            })
          })
      })
  })
    .then(() => {
      return batch.commit()
        .then(() => {
          httpsCallable(functions, 'onProjectTaskChange')({
            orgID, projectID, oldColumnID, newColumnID
          })
        })
        .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts))
    })
    .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts))
}

export const moveTaskToBacklogService = (tasksPath, myUserID, taskID, setToasts) => {
  const orgID = tasksPath.split('/')[1]
  const projectID = tasksPath.split('/')[3]
  const eventsPath = `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/events`
  return getLastBacklogTaskPosition(orgID, projectID)
    .then((position) => {
      return updateSingleTaskItemService(
        tasksPath,
        taskID,
        {
          inSprint: false,
          sprintID: null,
          columnID: null,
          position: null,
          backlogPosition: position + 1,
          status: 'backlog',
          isDone: false
        },
        setToasts
      )
        .then(() => {
          setToasts(successToast('Task moved to backlog.'))
          createOrgProjectTaskEvent(eventsPath, myUserID, `Task moved to backlog`, 'fas fa-task', setToasts)
        })
    })
    .catch(err => catchCode(err, 'There was a problem moving the task to the backlog. Please try again.', setToasts))
}

export const uploadOrgProjectTaskFiles = (filesPath, files, filesStoragePath, setLoading, setToasts) => {
  const orgID = filesPath.split('/')[1]
  const projectID = filesPath.split('/')[3]
  const taskID = filesPath.split('/')[5]
  return uploadMultipleFilesToFireStorage(files, filesStoragePath, null, null)
    .then((uploadedFiles) => {
      const batch = writeBatch(db)
      uploadedFiles.forEach(file => {
        const filesPath = `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/files`
        const filesDocID = getRandomDocID(filesPath)
        const fileRef = doc(db, filesPath, filesDocID)
        batch.set(fileRef, {
          dateUploaded: new Date(),
          fileID: filesDocID,
          name: file.file.name,
          projectID,
          size: file.file.size,
          taskID,
          type: file.file.type,
          url: file.downloadURL,
          fileStoragePath: filesStoragePath
        })
      })
      return batch.commit()
        .then(() => {
          setLoading(false)
          setToasts(successToast('Files uploaded successfully.'))
        })
        .catch(err => catchCode(err, 'There was a problem uploading the files. Please try again.', setToasts, setLoading))
    })
}

export const deleteOrgProjectTaskFilesService = (path, fileID, fileName, setToasts, setLoading) => {
  setLoading(true)
  return deleteMultipleStorageFiles(
    path,
    [fileName]
  )
    .then(() => {
      return deleteDB(path, fileID)
    })
    .then(() => {
      setToasts(successToast('File deleted successfully.'))
      setLoading(false)
    })
    .catch((err) => {
      setToasts(errorToast('There was an error deleting the file. Please try again.', true))
      setLoading(false)
      console.log(err)
    })
}

export const likeOrgProjectTaskCommentService = (userID, userHasLiked, commentsPath, commentID, setToasts) => {
  return updateDB(commentsPath, commentID, {
    likes: !userHasLiked ? firebaseArrayAdd(userID) : firebaseArrayRemove(userID)
  })
    .catch(err => catchCode(err, `There was a problem ${userHasLiked ? 'unliking' : 'liking'} the comment. Please try again.`, setToasts))
}

export const createOrgProjectTaskCommentService = (commentsPath, comment, setToasts, setLoading) => {
  setLoading(true)
  const projectID = commentsPath.split('/')[3]
  const taskID = commentsPath.split('/')[5]
  const commentID = getRandomDocID(commentsPath)
  return setDB(commentsPath, commentID, {
    ...comment,
    commentID,
    dateCreated: new Date(),
    dateModified: new Date(),
    isEdited: false,
    likes: [],
    projectID,
    taskID,
  })
    .then(() => {
      setLoading(false)
    })
    .catch(err => catchCode(err, 'There was a problem creating the comment. Please try again.', setToasts, setLoading))
}

export const updateOrgProjectTaskCommentService = (commentsPath, commentID, commentText, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(commentsPath, commentID, {
    text: commentText,
    dateModified: new Date(),
    isEdited: true
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Comment updated successfully.'))
    })
    .catch(err => catchCode(err, 'There was a problem updating the comment. Please try again.', setToasts, setLoading))
}

export const deleteOrgProjectTaskCommentService = (commentsPath, commentID, setToasts) => {
  return deleteDB(commentsPath, commentID)
    .then(() => {
      setToasts(successToast('Comment deleted successfully.'))
    })
    .catch(err => catchCode(err, 'There was a problem deleting the comment. Please try again.', setToasts))
}

export const createOrgProjectTaskEvent = (eventsPath, userID, title, icon, setToasts) => {
  const projectID = eventsPath.split('/')[3]
  const taskID = eventsPath.split('/')[5]
  const eventID = getRandomDocID(eventsPath)
  return setDB(eventsPath, eventID, {
    dateCreated: new Date(),
    eventID,
    title,
    projectID,
    taskID,
    ownerID: userID,
    icon
  })
    .catch(err => catchCode(err, 'There was a problem creating the event. Please try again.', setToasts))
}

export const deleteProjectTaskEvent = (eventsPath, eventID, setToasts) => {
  return deleteDB(eventsPath, eventID)
    .catch(err => catchCode(err, 'There was a problem deleting the event. Please try again.', setToasts))
}

export const sameColumnMoveBacklogTaskService = (path, taskID, source, destination, setToasts) => {
  const orgID = path.split('/')[1]
  const projectID = path.split('/')[3]
  const oldPosition = source.index
  const newPosition = destination.index
  const taskRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  const batch = writeBatch(db)
  return runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const path = `organizations/${orgID}/projects/${projectID}/tasks`
        const colRef = collection(db, path)
        const q = query(
          colRef,
          where('inSprint', '==', source.droppableId === 'sprint'),
          where('backlogPosition', '>=', Math.min(oldPosition, newPosition)),
          where('backlogPosition', '<=', Math.max(oldPosition, newPosition))
        )
        return getDocs(q)
          .then(snapshot => {
            snapshot.forEach((snap) => {
              const data = snap.data()
              const docID = snap.id
              const notItself = data.taskID !== taskID
              if (data.backlogPosition < newPosition && notItself) {
                batch.update(doc(db, path, docID), {
                  backlogPosition: firebaseIncrement(-1),
                })
              }
              if (data.backlogPosition > newPosition && notItself) {
                batch.update(doc(db, path, docID), {
                  backlogPosition: firebaseIncrement(1),
                })
              }
              if (data.backlogPosition === newPosition && notItself) {
                batch.update(doc(db, path, docID), {
                  backlogPosition: firebaseIncrement(data.backlogPosition < oldPosition ? 1 : -1),
                })
              }
            })
            batch.update(doc(db, path, taskID), {
              backlogPosition: newPosition
            })
          })
      })
  })
    .then(() => {
      return batch.commit()
    })
    .catch(err => catchCode(err, 'There was a problem moving the task. Please try again.', setToasts))
}

export const diffColumnMoveBacklogTaskService = (path, taskID, positions, source, destination, firstColumn, setToasts) => {
  const orgID = path.split('/')[1]
  const projectID = path.split('/')[3]
  const fromBacklog = source.droppableId === 'backlog'
  const fromSprint = source.droppableId === 'sprint'
  const toBacklog = destination.droppableId === 'backlog'
  const toSprint = destination.droppableId === 'sprint'
  const backlogToSprint = fromBacklog && toSprint
  const sprintToBacklog = fromSprint && toBacklog
  const oldPosition = source.index
  const newPosition = destination.index
  const taskRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  const batch = writeBatch(db)
  return runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const path = `organizations/${orgID}/projects/${projectID}/tasks`
        const colRef = collection(db, path)
        const q = query(colRef)
        return getDocs(q)
          .then(snapshot => {
            snapshot.forEach((snap) => {
              const data = snap.data()
              const docID = snap.id
              const sameColumnTasks = fromBacklog ? !data.inSprint : data.inSprint
              const notItself = data.taskID !== taskID
              if (data.backlogPosition > oldPosition && sameColumnTasks && notItself) {
                batch.update(doc(db, path, docID), {
                  backlogPosition: firebaseIncrement(-1),
                })
              }
              if (data.backlogPosition >= newPosition && !sameColumnTasks && notItself) {
                batch.update(doc(db, path, docID), {
                  backlogPosition: firebaseIncrement(1),
                })
              }
            })
          })
          .then(() => {
            if (backlogToSprint) {
              batch.update(doc(db, path, taskID), {
                backlogPosition: newPosition,
                position: positions.sprintPosition,
                inSprint: true,
                sprintID: positions.sprintID,
                status: firstColumn.title,
                columnID: firstColumn.columnID
              })
            }
            else if (sprintToBacklog) {
              batch.update(doc(db, path, taskID), {
                backlogPosition: newPosition,
                position: null,
                inSprint: false,
                status: 'backlog',
                isDone: false,
                columnID: null
              })
            }
          })
      })
  })
    .then(() => {
      return batch.commit()
    })
    .catch(err => catchCode(err, 'There was a problem moving the task. Please try again.', setToasts))
}

export const addNewBacklogTaskService = (path, myUserID, projectName, task, setToasts, setLoading) => {
  setLoading(true)
  const orgID = path.split('/')[1]
  const projectID = path.split('/')[3]
  const docID = getRandomDocID(path)
  return getDocsCount(path)
    .then(tasksCount => {
      return getLastBacklogTaskPosition(orgID, projectID)
        .then((lastBacklogPosition) => {
          return setDB(path, docID, {
            assigneesIDs: [],
            backlogPosition: lastBacklogPosition + 1,
            columnID: null,
            creatorID: myUserID,
            dateCreated: new Date(),
            dateModified: new Date(),
            description: '',
            inSprint: false,
            orgID,
            points: 0,
            position: null,
            priority: 'medium',
            projectID,
            reporterID: myUserID,
            sprintID: null,
            status: 'backlog',
            taskID: docID,
            taskNum: `${projectName.slice(0, 3).toUpperCase()}-${(tasksCount + 1) < 10 ? '0' : ''}${tasksCount + 1}`,
            taskType: task.newTaskType,
            title: task.newTaskTitle,
          })
        })
    })
    .then(() => {
      setLoading(false)
      return docID
    })
    .catch(err => catchCode(err, 'There was a problem adding the task. Please try again.', setToasts, setLoading))
}

export const addNewSprintTaskService = (path, myUserID, sprintID, firstColumn, projectName, task, setToasts, setLoading) => {
  setLoading(true)
  const orgID = path.split('/')[1]
  const projectID = path.split('/')[3]
  const docID = getRandomDocID(path)
  return getDocsCount(path)
    .then(tasksCount => {
      return getLastSprintTaskPosition(orgID, projectID, sprintID)
        .then((lastBacklogPosition) => {
          return setDB(path, docID, {
            assigneesIDs: [],
            backlogPosition: lastBacklogPosition + 1,
            columnID: null,
            creatorID: myUserID,
            dateCreated: new Date(),
            dateModified: new Date(),
            description: '',
            inSprint: true,
            orgID,
            points: 0,
            position: null,
            priority: 'medium',
            projectID,
            reporterID: myUserID,
            sprintID,
            status: firstColumn?.title || 'backlog',
            taskID: docID,
            taskNum: `${projectName.slice(0, 3).toUpperCase()}-${(tasksCount + 1) < 10 ? '0' : ''}${tasksCount + 1}`,
            taskType: task.newTaskType,
            title: task.newTaskTitle,
          })
        })
    })
    .then(() => {
      setLoading(false)
      return docID
    })
    .catch(err => catchCode(err, 'There was a problem adding the task. Please try again.', setToasts, setLoading))
}

export const startProjectSprintService = (path, project, firstColumn, setToasts, setLoading) => {
  setLoading(true)
  const batch = writeBatch(db)
  const orgID = path.split('/')[1]
  const newSprintName = `Sprint ${project.sprintNumber + 1}`
  const newSprintID = `sprint-${project.sprintNumber + 1}`
  return updateDB(path, project.projectID, {
    activeSprintID: newSprintID,
    isSprintActive: true,
    sprintNumber: firebaseIncrement(1),
    sprintName: newSprintName
  })
    .then(() => {
      const tasksPath = `organizations/${orgID}/projects/${project.projectID}/tasks`
      const docRef = collection(db, tasksPath)
      const q = query(
        docRef,
        where('inSprint', '==', true)
      )
      return getDocs(q)
        .then((snapshot) => {
          for (const snap of snapshot.docs) {
            const data = snap.data()
            const docID = snap.id
            batch.update(doc(db, tasksPath, docID), {
              sprintID: newSprintID,
              status: firstColumn.title,
              position: data.backlogPosition,
              columnID: firstColumn.columnID
            })
          }
        })
    })
    .then(() => {
      return batch.commit()
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Sprint started.'))
    })
    .catch(err => catchCode(err, 'There was a problem starting the sprint. Please try again.', setToasts, setLoading))
}

export const completeProjectSprintService = (path, project, moveTasksTo, setToasts, setLoading) => {
  setLoading(true)
  const orgID = path.split('/')[1]
  const newSprintName = `Sprint ${project.sprintNumber + 1}`
  const newSprintID = `sprint-${project.sprintNumber + 1}`
  return getOrgProjectFirstColumn(orgID, project.projectID)
    .then((firstColumn) => {
      return getOrgProjectLastColumn(orgID, project.projectID)
        .then((lastColumn) => {
          const batch = writeBatch(db)
          const tasksPath = `organizations/${orgID}/projects/${project.projectID}/tasks`
          const docRef = collection(db, tasksPath)
          const q = query(
            docRef,
          )
          return getDocs(q)
            .then((snapshot) => {
              for (const snap of snapshot.docs) {
                const docID = snap.id
                if (snap.data().columnID === lastColumn.columnID) {
                  batch.update(doc(db, tasksPath, docID), {
                    columnID: null,
                    inSprint: false,
                    status: 'completed',
                    position: null,
                    backlogPosition: null,
                    dateModified: new Date(),
                    isDone: true,
                    sprintID: null
                  })
                }
                if (moveTasksTo === 'backlog' && snap.data().columnID !== lastColumn.columnID) {
                  batch.update(doc(db, tasksPath, docID), {
                    columnID: null,
                    inSprint: false,
                    status: 'backlog',
                    position: null,
                    dateModified: new Date(),
                    sprintID: null
                  })
                }
                else if (moveTasksTo === 'new-sprint' && snap.data().columnID !== lastColumn.columnID) {
                  batch.update(doc(db, tasksPath, docID), {
                    columnID: firstColumn.columnID,
                    dateModified: new Date(),
                    sprintID: newSprintID
                  })
                }
              }
            })
            .then(() => {
              return batch.commit()
            })
        })
    })
    .then(() => {
      if (moveTasksTo === 'backlog') {
        return updateDB(path, project.projectID, {
          activeSprintID: null,
          isSprintActive: false,
          sprintName: '',
          sprintGoal: ''
        })
      }
      else if (moveTasksTo === 'new-sprint') {
        return updateDB(path, project.projectID, {
          activeSprintID: newSprintID,
          isSprintActive: true,
          sprintNumber: firebaseIncrement(1),
          sprintName: newSprintName,
          sprintGoal: ''
        })
      }
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Sprint completed.'))
    })
    .catch(err => catchCode(err, 'There was a problem completing the sprint. Please try again.', setToasts, setLoading))

}

export const inviteMembersToProjectService = (orgID, project, inviteesIDs, myUserID, inviterName, setToasts, setLoading) => {
  setLoading(true)
  const batch = writeBatch(db)
  const projectPath = `organizations/${orgID}/projects`
  return updateDB(projectPath, project.projectID, {
    invitations: inviteesIDs
  })
    .then(() => {
      for (const inviteeID of inviteesIDs) {
        const userProjectsInvitePath = `users/${inviteeID}/projectInvitations`
        const usersNotifsPath = `users/${inviteeID}/notifications`
        const inviteID = getRandomDocID(userProjectsInvitePath)
        const notifID = getRandomDocID(usersNotifsPath)
        batch.set(doc(db, userProjectsInvitePath, inviteID), {
          invitationID: inviteID,
          orgID,
          projectID: project.projectID,
          projectName: project.name,
          dateCreated: new Date(),
          message: `${inviterName} has invited you to join their project: ${project.name}.`,
        })
        batch.set(doc(db, usersNotifsPath, notifID), {
          notificationID: notifID,
          dateCreated: new Date(),
          isRead: false,
          title: `${inviterName} has invited you to join their project: ${project.name}. You can ` +
            `accept or decline the invitation in your profile page under the invitations tab.`,
          text: 'New Project Invitation',
          icon: 'fas fa-project-diagram',
          url: '/my-profile/projects-invitations'
        })
      }
      //send also invitations by email
      return batch.commit()
    })
    .then(() => {
      return createNotification(
        myUserID,
        'Project invitations sent',
        `Your invitations to join ${project.name} have been sent.`,
        'fas fa-project-diagram',
        `/projects/${project.projectID}/backlog`
      )
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Project invitations have been sent.'))
    })
    .catch(err => catchCode(err, 'There was a problem sending the invitations. Please try again.', setToasts, setLoading))
}

export const cancelOrgProjectInvitationService = (orgID, project, userID, setToasts, setLoading) => {
  const confirm = window.confirm('Are you sure you want to cancel this invitation?')
  if (!confirm) return
  setLoading(true)
  const projectPath = `organizations/${orgID}/projects`
  return updateDB(projectPath, project.projectID, {
    invitations: firebaseArrayRemove(userID)
  })
    .then(() => {
      const userProjectsInvitePath = `users/${userID}/projectInvitations`
      const q = query(
        collection(db, userProjectsInvitePath),
        where('projectID', '==', project.projectID)
      )
      return getDocs(q)
        .then((snapshot) => {
          return deleteDB(userProjectsInvitePath, snapshot.docs[0].id)
        })
    })
    .then(() => {
      return createNotification(
        userID,
        'Project invitation cancelled',
        `Your invitation to project: ${project.name} has been cancelled. You can ` +
        `inquire about the cancellation with your organization admin.`,
        'fas fa-project-diagram',
        `/my-organization`
      )
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast(`The project invitation has been cancelled.`))
    })
    .catch(err => catchCode(err, 'There was a problem cancelling the invitation. Please try again.', setToasts, setLoading))
}

export const newPublishProjectPageService = (path, myUserID, title, content, setToasts, setLoading) => {
  setLoading(true)
  const orgID = path.split('/')[1]
  const projectID = path.split('/')[3]
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    content,
    creatorID: myUserID,
    dateCreated: new Date(),
    dateModified: new Date(),
    editorsIDs: [myUserID],
    isPublished: true,
    orgID,
    projectID,
    pageID: docID,
    status: 'published',
    title,
    type: 'general'
  })
    .then(() => {
      setToasts(successToast('The page has been published.'))
      setLoading(false)
      return docID
    })
    .catch(err => catchCode(err, 'There was a problem publishing the page. Please try again.', setToasts, setLoading))
}

export const updatePublishProjectPageService = (path, pageID, title, content, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, pageID, {
    isPublished: true,
    dateModified: new Date(),
    title,
    content
  })
    .then(() => {
      setToasts(successToast('The page has been published.'))
      setLoading(false)
    })
    .catch(err => catchCode(err, 'There was a problem publishing the page. Please try again.', setToasts, setLoading))
}

export const updateProjectPageService = (path, pageID, project, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, pageID, {
    ...project,
    dateModified: new Date()
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast('The page has been updated.'))
    })
    .catch(err => catchCode(err, 'There was a problem updating the page. Please try again.', setToasts, setLoading))
}

export const deleteProjectPageService = (path, pageID, setToasts, setLoading) => {
  setLoading(true)
  return deleteDB(path, pageID)
    .then(() => {
      setLoading(false)
      setToasts(successToast('The page has been deleted.'))
    })
    .catch(err => catchCode(err, 'There was a problem deleting the page. Please try again.', setToasts, setLoading))
}

export const projectPageInviteMembersService = (path, page, inviteesIDs, inviterName, setToasts, setLoading) => {
  setLoading(true)
  const batch = writeBatch(db)
  const projectID = path.split('/')[3]
  return updateDB(path, page.pageID, {
    editorsIDs: firebaseArrayAdd(...inviteesIDs),
    dateModified: new Date()
  })
    .then(() => {
      for (const inviteeID of inviteesIDs) {
        const usersNotifsPath = `users/${inviteeID}/notifications`
        const notifID = getRandomDocID(usersNotifsPath)
        batch.set(doc(db, usersNotifsPath, notifID), {
          notificationID: notifID,
          dateCreated: new Date(),
          isRead: false,
          title: `${inviterName} has invited you to edit the project page: ${page.title}.`,
          text: 'Project Page Edit Invitation',
          icon: 'fas fa-file-alt',
          url: `/projects/${projectID}/pages/${page.pageID}/edit?edit=true`
        })
      }
    })
    .then(() => {
      return batch.commit()
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('User invitations have been sent.'))
    })
    .catch(err => catchCode(err, 'There was a problem sending the invitations. Please try again.', setToasts, setLoading))
}

export const requestProjectAccessService = (path, myUser, project, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, project.projectID, {
    requests: firebaseArrayAdd(myUser.userID)
  })
    .then(() => {
      return createNotification(
        project.ownerID,
        'Project access requested',
        `${myUser.firstName} ${myUser.lastName} has requested access to join your project: ${project.name}.`,
        'fas fa-project-diagram',
        `/projects/${project.projectID}/settings`
      )
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('Your request has been sent.'))
    })
    .catch(err => catchCode(err, 'There was a problem sending your request. Please try again.', setToasts, setLoading))
}

export const acceptProjectRequestService = (path, userID, project, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, project.projectID, {
    members: firebaseArrayAdd(userID),
    requests: firebaseArrayRemove(userID)
  })
    .then(() => {
      return createNotification(
        userID,
        'Project access granted',
        `Your request to join project: ${project.name} has been granted. You can ` +
        `now access the project here.`,
        'fas fa-project-diagram',
        `/projects/${project.projectID}/backlog`
      )
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('The request has been accepted.'))
    })
    .catch(err => catchCode(err, 'There was a problem accepting the request. Please try again.', setToasts, setLoading))
}

export const declineProjectRequestService = (path, userID, project, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, project.projectID, {
    requests: firebaseArrayRemove(userID)
  })
    .then(() => {
      return createNotification(
        userID,
        'Project access declined',
        `Your request to join project: ${project.name} has been declined. You can ` +
        `inquire about the decline with your organization admin.`,
        'fas fa-project-diagram',
        `/my-organization`
      )
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('The request has been declined.'))
    })
    .catch(err => catchCode(err, 'There was a problem declining the request. Please try again.', setToasts, setLoading))
}

export const removeProjectMemberService = (path, userID, project, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, project.projectID, {
    members: firebaseArrayRemove(userID)
  })
    .then(() => {
      return createNotification(
        userID,
        'Project access removed',
        `You have been removed from project: ${project.name}. You can ` +
        `inquire about the removal with your organization admin.`,
        'fas fa-project-diagram',
        `/my-organization`
      )
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast('The member has been removed from this project.'))
    })
    .catch(err => catchCode(err, 'There was a problem removing the member. Please try again.', setToasts, setLoading))
}

export const updateProjectSprintDetails = (path, projectID, sprint, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(path, projectID, {
    sprintName: sprint.sprintName,
    sprintGoal: sprint.sprintGoal,
    dateModified: new Date()
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast('The sprint details have been updated.'))
    })
    .catch(err => catchCode(err, 'There was a problem updating the sprint details. Please try again.', setToasts, setLoading))
}