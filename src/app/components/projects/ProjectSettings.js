import { deleteOrgProjectService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import './styles/ProjectSettings.css'

export default function ProjectSettings({project}) {

  const { setPageLoading, myOrgID, setToasts } = useContext(StoreContext)
  const projectID = useParams().projectID
  const navigate = useNavigate()

  const deleteProject = () => {
    const confirm = window.confirm('Are you sure you want to delete this project? You will ' +
      'lose all sprints info, project tasks and associated files. This action cannot be undone.')
    if (!confirm) return
    setPageLoading(true)
    deleteOrgProjectService(
      myOrgID,
      projectID,
      project?.name,
      setToasts,
      setPageLoading
    )
  }

  return (
    <div className="project-settings">
      
    </div>
  )
}
