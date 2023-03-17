import { requestProjectAccessService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import './styles/AskProjectAccess.css'

export default function AskProjectAccess({ project }) {

  const { myUser, myUserID, setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const projectPath = `organizations/${project?.orgID}/projects`
  const hasRequestedAccess = project?.requests?.includes(myUserID)

  const requestProjectAccess = () => {
    requestProjectAccessService(
      projectPath,
      myUser,
      project,
      setToasts,
      setLoading
    )
  }

  return (
    <div className="ask-project-access">
      <i className="fas fa-user-lock" />
      <div className="project-item">
        <Avatar
          dimensions={30}
          src={project?.photoURL}
        />
        <h5>{project?.name}</h5>
      </div>
      {
        hasRequestedAccess ?
          <small>Your request to join the project is pending.</small> :
          <>
            <h4>You are not a member of this project</h4>
            <p>You can ask your organization admin for access here.</p>
            <AppButton
              label="Ask for access"
              rightIcon="fas fa-key"
              onClick={() => requestProjectAccess()}
              loading={loading}
            />
          </>
      }
    </div>
  )
}
