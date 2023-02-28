import {
  getAllOrgOpenProjectTasks,
  getOrgProjectByID, getOrgProjectClosedTasks, getOrgProjectColumnByID,
  getOrgProjectColumns, getOrgProjectFirstColumn, getOrgProjectOpenTasks, getOrgProjectTaskByID,
  getOrgProjectTaskComments, getOrgProjectTaskEvents,
  getOrgProjectTaskFiles, getOrgProjectTasks,
  getOrgProjectTasksByColumnID, getOrgProjectTasksByColumnsArray,
  getOrgProjectTasksBySprintID,
  getOrgProjectTasksInBacklog,
  getProjectsByOrgID
} from "app/services/projectsServices"
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
  }, [myOrgID, projectID, limit])

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

export const useOrgProjectFirstColumn = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [column, setColumn] = useState(null)

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectFirstColumn(myOrgID, projectID)
        .then((column) => setColumn(column))
  }, [myOrgID, projectID])

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

export const useBuildProjectBoard = (projectID, tasksFilter) => {

  const { myOrgID } = useContext(StoreContext)
  const columns = useOrgProjectColumns(projectID)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && columns.length)
      getOrgProjectTasksByColumnsArray(myOrgID, projectID, columns, setTasks)
  }, [myOrgID, projectID, columns, tasksFilter])

  return {
    columns: columns?.map(column => ({
      ...column,
      id: column?.columnID,
      cards: tasksFilter(tasks, column)
        .map(task => ({
          ...task,
          id: task?.taskID,
        }))
    }))
  }
}

export const useOrgProjectSprintTasks = (projectID, sprintID) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && sprintID)
      getOrgProjectTasksBySprintID(myOrgID, projectID, sprintID, setTasks)
  }, [myOrgID, projectID, sprintID])

  return tasks
}

export const useOrgProjectBacklogTasks = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectTasksInBacklog(myOrgID, projectID, setTasks)
  }, [myOrgID, projectID])

  return tasks
}

export const useOrgProjectTaskFiles = (projectID, taskID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [files, setFiles] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && taskID)
      getOrgProjectTaskFiles(myOrgID, projectID, taskID, setFiles, limit)
  }, [myOrgID, projectID, taskID, limit])

  return files
}

export const useOrgProjectTaskComments = (projectID, taskID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && taskID)
      getOrgProjectTaskComments(myOrgID, projectID, taskID, setComments, limit)
  }, [myOrgID, projectID, taskID, limit])

  return comments
}

export const useOrgProjectTaskEvents = (projectID, taskID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && taskID)
      getOrgProjectTaskEvents(myOrgID, projectID, taskID, setEvents, limit)
  }, [myOrgID, projectID, taskID, limit])

  return events
}

export const useOpenProjectTasks = (projectID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectOpenTasks(myOrgID, projectID, setTasks, limit)
  }, [myOrgID, projectID, limit])

  return tasks
}

export const useClosedProjectTasks = (projectID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID)
      getOrgProjectClosedTasks(myOrgID, projectID, setTasks, limit)
  }, [myOrgID, projectID, limit])

  return tasks
}

export const useAllOrgOpenProjectTasks = (limit, sortBy) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID)
      getAllOrgOpenProjectTasks(myOrgID, setTasks, sortBy, limit)
  }, [myOrgID, sortBy, limit])

  return tasks
}
