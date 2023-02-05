import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import {
  collection, doc, getDocs, limit,
  onSnapshot, orderBy, query, where, writeBatch
} from "firebase/firestore"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { uploadMultipleFilesToFireStorage } from "./storageServices"

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
    orderBy('number', 'asc'),
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
    orderBy('number', 'asc'),
    where('columnID', '==', columnID)
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const getOrgProjectTasksByColumnsArray = (orgID, projectID, columnsArray) => {
  const tasks = []
  return Promise.all(columnsArray.map(column => {
    const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
    const q = query(
      docRef,
      orderBy('number', 'asc'),
      where('columnID', '==', column.columnID)
    )
    return getDocs(q)
      .then((snapshot) => {
        if(!snapshot.empty) {
          return tasks.push(...snapshot.docs.map(doc => doc.data()))
        }
      })
  }))
    .then(() => {
      return tasks
    })
    .catch(err => {
      console.log(err)
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
    .catch(err => {
      console.log(err)
      setToasts(errorToast('There was a problem updating the column title. Please try again.'))
    })
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
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('There was a problem creating the column. Please try again.', true))
    })
}

export const deleteProjectColumnService = (orgID, projectID, columnID, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/projects/${projectID}/columns`
  return deleteDB(path, columnID)
    .then(() => {
      setLoading(false)
      setToasts(successToast('Column deleted successfully.'))
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('There was a problem deleting the column. Please try again.', true))
    })
}

export const createProjectTaskService = (orgID, userID, project, columnID, task, files, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/projects/${project.projectID}/tasks`
  const docID = getRandomDocID(path)
  const storagePath = `organizations/${orgID}/projects/${project.projectID}/tasks/${docID}/files`
  return uploadMultipleFilesToFireStorage(files, storagePath, null)
    .then((uploadedFiles) => {
      return setDB(path, docID, {
        assigneesIDs: task.assigneesIDs,
        columnID,
        creatorID: userID,
        dateCreated: new Date(),
        dateModified: new Date(),
        description: task.description,
        number: task.taskNumber,
        priority: task.priority,
        projectID: project.projectID,
        sprintID: null,
        status: task.status,
        taskID: docID,
        taskNum: `${project.name.slice(0, 3).toUpperCase()}-${task.taskNumber < 10 && '0'}${task.taskNumber}`,
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
        .catch(err => {
          console.log(err)
          setLoading(false)
          setToasts(errorToast('There was a problem creating the task. Please try again.', true))
        })
    })
    .then(() => {
      setLoading(false)
      setToasts(successToast(`Task created successfully. ${task.addTo === 'sprint' && 'Adding to sprint...'}`))
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('There was a problem creating the task. Please try again.', true))
    })
}

export const getLastProjectTaskNumber = (orgID, projectID) => {
  const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
  const q = query(
    docRef,
    orderBy('number', 'desc'),
    limit(1)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map(doc => doc.data().number)
    })
}