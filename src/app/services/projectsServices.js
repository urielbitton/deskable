import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { collection, doc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"

export const getProjectsByOrgID = (orgID, setProjects, lim) => {
  const docRef = collection(db, `organizations/${orgID}/projects`)
  const q = query(
    docRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setProjects(snapshot.docs.map(doc => doc.data() ))
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

export const getOrgProjectTasksByColumnsArray = (orgID, projectID, columnsArray, setTasks) => {
  return Promise.all(columnsArray.map(column => {
    const docRef = collection(db, `organizations/${orgID}/projects/${projectID}/tasks`)
    const q = query(
      docRef,
      orderBy('number', 'asc'),
      where('columnID', '==', column.columnID)
    )
    onSnapshot(q, (snapshot) => {
      return snapshot.docs.map(doc => doc.data())
    })
  }))
  .then((tasks) => {
    setTasks(tasks)
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
    number: 0,
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
    setToasts(errorToast('There was a problem creating the column. Please try again.'))
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
    setToasts(errorToast('There was a problem deleting the column. Please try again.'))
  })
}

export const createProjectTaskService = (orgID, userID, project, column, task, setLoading, setToasts) => {
  setLoading(true)
  const taskNumber = task.number + 1 || 0
  const path = `organizations/${orgID}/projects/${project.projectID}/tasks`
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    assigneesIDs: task.assigneesIDs,
    columnID: column.columnID,
    creatorID: userID,
    dateCreated: new Date(),
    dateModified: new Date(),
    description: task.description,
    number: taskNumber,
    priority: task.priority,
    projectID: project.projectID,
    sprintID: null,
    status: column.title.toLowerCase(),
    taskID: docID,
    taskNum: `${project.name.slice(0, 3).toUpperCase()}-${taskNumber < 10 && '0'}${taskNumber}`,
    taskType: task.taskTpe,
    title: task.title
  })
  .then(() => {
    setLoading(false)
    setToasts(successToast('Task created successfully.'))
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
    setToasts(errorToast('There was a problem creating the task. Please try again.'))
  })
}