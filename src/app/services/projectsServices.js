import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { db, functions } from "app/firebase/fire"
import {
  collection, doc, getDocs, limit,
  onSnapshot, orderBy, query, runTransaction, where, writeBatch
} from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { deleteDB, firebaseArrayAdd, firebaseArrayRemove, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { deleteMultipleStorageFiles, uploadMultipleFilesToFireStorage } from "./storageServices"

export const getProjectsByOrgID = (orgID, setProjects, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects`)
  const q = query(
    docRef,
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
  onSnapshot(docRef, (snapshot) => {
    setColumns(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectColumnByID = (orgID, projectID, columnID, setColumn) => {
  const docRef = doc(db, `organizations/${orgID}/projects/${projectID}/columns`, columnID)
  onSnapshot(docRef, (doc) => {
    setColumn(doc.data())
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


export const catchCode = (err, errorText, setToasts, setLoading) => {
  console.log(err)
  setLoading && setLoading(false)
  setToasts && setToasts(errorToast(errorText, true))
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

export const deleteProjectColumnService = (orgID, projectID, columnID, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/projects/${projectID}/columns`
  return deleteDB(path, columnID)
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
  return uploadMultipleFilesToFireStorage(files, storagePath, null)
    .then((uploadedFiles) => {
      return setDB(path, docID, {
        assigneesIDs: task.assigneesIDs,
        columnID,
        inSprint: task.addTo === 'sprint',
        creatorID: userID,
        dateCreated: new Date(),
        dateModified: new Date(),
        description: task.description,
        position: task.taskPosition,
        priority: task.priority,
        projectID: project.projectID,
        points: task.points,
        reporter: task.reporter,
        sprintID: null,
        status: task.status,
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
      setToasts(successToast(`Task created successfully. ${task.addTo === 'sprint' && 'Adding to sprint...'}`))
    })
    .catch(err => catchCode(err, 'There was a problem creating the task. Please try again.', setToasts, setLoading))
}

export const updateSingleTaskItemService = (orgID, projectID, taskID, item, setToasts) => {
  const path = `organizations/${orgID}/projects/${projectID}/tasks`
  return updateDB(path, taskID, {
    ...item,
    dateModified: new Date()
  })
    .then(() => {
      setToasts(successToast('Task updated successfully.'))
    })
    .catch(err => catchCode(err, 'There was a problem updating the task. Please try again.', setToasts))
}

export const deleteProjectTaskService = (path, taskID, setLoading, setToasts) => {
  setLoading(true)
  const taskRef = doc(db, path, taskID)
  const batch = writeBatch(db)
  return runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        batch.delete(taskRef)
        const columnID = snapshot.data().columnID
        const position = snapshot.data().position
        const colRef = collection(db, path)
        const q = query(
          colRef,
          where('columnID', '==', columnID),
          where('position', '>', position)
        )
        onSnapshot(q, (snapshot) => {
          snapshot.forEach((snap) => {
            const docID = snap.id
            batch.update(doc(db, path, docID), {
              position: firebaseIncrement(-1)
            })
          })
        })
      })
      .catch(err => catchCode(err, 'There was a problem deleting the task. Please try again.', setToasts, setLoading))
  })
    .then(() => {
      return batch.commit()
        .then(() => {
          setLoading(false)
          setToasts(successToast('Task deleted successfully.'))
        })
        .catch(err => catchCode(err, 'There was a problem deleting the task. Please try again.', setToasts, setLoading))
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
      return snapshot.docs.map(doc => doc.data().position)[0] || 0
    })
    .catch(err => console.log(err))
}

export const changeSameColumnTaskPositionService = (orgID, projectID, task, newPosition, setLoading, setToasts) => {
  const taskID = task.taskID
  const columnID = task.columnID
  const oldPosition = task.position
  const taskRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  const batch = writeBatch(db)
  runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const path = `organizations/${orgID}/projects/${projectID}/tasks`
        const q = query(
          collection(db, path),
          where('columnID', '==', columnID),
          where('position', '>=', Math.min(oldPosition, newPosition)),
          where('position', '<=', Math.max(oldPosition, newPosition))
        )
        onSnapshot(q, (snapshot) => {
          snapshot.forEach((snap) => {
            const data = snap.data()
            const docID = snap.id
            if (data.columnID === columnID) {
              if (data.position < newPosition && data.taskID !== taskID) {
                batch.update(doc(db, path, docID), {
                  position: firebaseIncrement(-1)
                })
              }
              if (data.position > newPosition && data.taskID !== taskID) {
                batch.update(doc(db, path, docID), {
                  position: firebaseIncrement(1)
                })
              }
              if (data.position === newPosition && data.taskID !== taskID) {
                batch.update(doc(db, path, docID), {
                  position: firebaseIncrement(data.position < oldPosition ? 1 : -1)
                })
              }
              if (data.taskID === taskID) {
                batch.update(doc(db, path, docID), {
                  position: newPosition
                })
              }
            }
          })
        })
      })
  })
    .then(() => {
      return batch.commit()
        .then(() => {
          setLoading(false)
        })
        .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts, setLoading))
    })
    .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts, setLoading))
}

export const changeDiffColumnTaskPositionService = (orgID, projectID, task, newPosition, oldColumnID, 
  newColumnID, columns, setLoading, setToasts) => {
  const newColumnTitle = columns.filter(column => column.columnID === newColumnID)[0].title
  const taskID = task.taskID
  const columnID = task.columnID
  const oldPosition = task.position
  const taskRef = doc(db, `organizations/${orgID}/projects/${projectID}/tasks`, taskID)
  const batch = writeBatch(db)
  runTransaction(db, (transaction) => {
    return transaction.get(taskRef)
      .then((snapshot) => {
        const path = `organizations/${orgID}/projects/${projectID}/tasks`
        const colRef = collection(db, path)
        const q = query(colRef)
        onSnapshot(q, (snapshot) => {
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
                status: newColumnTitle
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
          setLoading(false)
        })
        .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts, setLoading))
    })
    .catch(err => catchCode(err, 'There was a problem updating the task position. Please try again.', setToasts, setLoading))
}

export const uploadOrgProjectTaskFiles = (orgID, projectID, taskID, files, filesStoragePath, setLoading, setToasts) => {
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
          url: file.downloadURL
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

export const createOrgProjectTaskCommentService = (orgID, projectID, taskID, comment, setToasts, setLoading) => {
  setLoading(true)
  const commentsPath = `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/comments`
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