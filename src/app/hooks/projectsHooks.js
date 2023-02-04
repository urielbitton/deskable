import { getOrgProjectByID, getOrgProjectColumnByID, getOrgProjectColumns, getOrgProjectTaskByID, getOrgProjectTasks, getOrgProjectTasksByColumnID, getOrgProjectTasksByColumnsArray, getProjectsByOrgID } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useOrgProjects = (limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getProjectsByOrgID(myOrgID, setProjects, limit)
  }, [myOrgID, limit])

  return projects
}

export const useOrgProject = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [project, setProject] = useState(null)

  useEffect(() => {
    getOrgProjectByID(myOrgID, projectID, setProject)
  }, [myOrgID, projectID])

  return project
}

export const useOrgProjectTasks = (projectID, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getOrgProjectTasks(myOrgID, projectID, setTasks, limit)
  }, [myOrgID, projectID])

  return tasks
}

export const useOrgProjectTask = (projectID, taskID) => {

  const { myOrgID } = useContext(StoreContext)
  const [task, setTask] = useState(null)

  useEffect(() => {
    getOrgProjectTaskByID(myOrgID, projectID, taskID, setTask)
  }, [myOrgID, projectID, taskID])

  return task
}

export const useOrgProjectColumns = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [columns, setColumns] = useState([])

  useEffect(() => {
    getOrgProjectColumns(myOrgID, projectID, setColumns)
  }, [myOrgID, projectID])

  return columns
}

export const useOrgProjectColumn = (projectID, columnID) => {

  const { myOrgID } = useContext(StoreContext)
  const [column, setColumn] = useState(null)

  useEffect(() => {
    getOrgProjectColumnByID(myOrgID, projectID, columnID, setColumn)
  }, [myOrgID, projectID, columnID])

  return column
}

export const useOrgProjectColumnTasks = (projectID, columnID) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getOrgProjectTasksByColumnID(myOrgID, projectID, columnID, setTasks)
  }, [myOrgID, projectID, columnID])

  return tasks
}

export const useBuildProjectBoard = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const columns = useOrgProjectColumns(projectID)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (myOrgID && projectID && columns)
      getOrgProjectTasksByColumnsArray(myOrgID, projectID, columns)
        .then((tasks) => {
          // @ts-ignore
          setTasks(tasks)
        })
  }, [myOrgID, projectID, columns])

  return {
    columns: columns?.map(column => ({
      id: column?.columnID,
      title: column?.title,
      cards: tasks
        ?.filter(task => task?.columnID === column?.columnID)
        .map(task => ({
          id: task?.taskID,
          title: task?.title,
          description: task?.description
        }))
    }))
  }
}