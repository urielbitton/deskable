import { getOrgProjectByID, getOrgProjectTaskByID, getOrgProjectTasks, getProjectsByOrgID } from "app/services/projectsServices"
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

export const useOrgProjectTasks = (projectID) => {

  const { myOrgID } = useContext(StoreContext)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getOrgProjectTasks(myOrgID, projectID, setTasks)
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
