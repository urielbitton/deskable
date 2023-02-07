import { getOrgProjectByID, getOrgProjectColumnByID, getOrgProjectColumns, getOrgProjectTaskByID, getOrgProjectTaskComments, getOrgProjectTaskFiles, getOrgProjectTasks, getOrgProjectTasksByColumnID, getOrgProjectTasksByColumnsArray, getProjectsByOrgID } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useOrgProjects = (limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (myOrgID)
      getProjectsByOrgID(myOrgID, setProjects, limit)
  }, [myOrgID, limit])

  return projects
}

export const useOrgProject = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [project, setProject] = useState(null)

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectByID(myOrgID, projectID, setProject)
  }, [myOrgID, projectID])

  return project
}

export const useOrgProjectTasks = (projectID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectTasks(myOrgID, projectID, setTasks, limit)
  }, [myOrgID, projectID])

  return tasks
}

export const useOrgProjectTask = (projectID, taskID) => {

  const { myOrgID } = useContext(StoreContext)
  const [task, setTask] = useState(null)

  useEffect(() => {
    if (taskID && projectID && myOrgID)
      getOrgProjectTaskByID(myOrgID, projectID, taskID, setTask)
  }, [myOrgID, projectID, taskID])

  return task
}

export const useOrgProjectColumns = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [columns, setColumns] = useState([])

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectColumns(myOrgID, projectID, setColumns)
  }, [myOrgID, projectID])

  return columns
}

export const useOrgProjectColumn = (projectID, columnID) => {

  const { myOrgID } = useContext(StoreContext)
  const [column, setColumn] = useState(null)

  useEffect(() => {
    if (myOrgID && projectID && columnID)
      getOrgProjectColumnByID(myOrgID, projectID, columnID, setColumn)
  }, [myOrgID, projectID, columnID])

  return column
}

export const useOrgProjectColumnTasks = (projectID, columnID) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && columnID)
      getOrgProjectTasksByColumnID(myOrgID, projectID, columnID, setTasks)
  }, [myOrgID, projectID, columnID])

  return tasks
}

export const useBuildProjectBoard = (projectID, columnUpdate) => {

  const { myOrgID } = useContext(StoreContext)
  const columns = useOrgProjectColumns(projectID)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && columns.length)
      getOrgProjectTasksByColumnsArray(myOrgID, projectID, columns, setTasks)
  }, [myOrgID, projectID, columns, columnUpdate])

  return {
    columns: columns?.map(column => ({
      ...column,
      id: column?.columnID,
      cards: tasks
        ?.filter(task => task?.columnID === column?.columnID)
        .map(task => ({
          ...task,
          id: task?.taskID,
        }))
    }))
  }
}

export const useOrgProjectTaskFiles = (projectID, taskID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [files, setFiles] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && taskID)
      getOrgProjectTaskFiles(myOrgID, projectID, taskID, setFiles, limit)
  }, [myOrgID, projectID, taskID])

  return files
}

export const useOrgProjectTaskComments = (projectID, taskID, limit) => {
  
    const { myOrgID } = useContext(StoreContext)
    const [comments, setComments] = useState([])
  
    useEffect(() => {
      if (myOrgID && projectID && taskID)
        getOrgProjectTaskComments(myOrgID, projectID, taskID, setComments, limit)
    }, [myOrgID, projectID, taskID])
  
    return comments
  }