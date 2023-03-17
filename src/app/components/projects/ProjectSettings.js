import { projectAvatarsList, projectCategoriesOptions, 
  switchProjectCategory } from "app/data/projectsData"
import { deleteOrgProjectService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import SettingsSection from "../settings/SettingsSection"
import { AppInput, AppReactSelect, AppTextarea } from "../ui/AppInputs"
import AvatarPicker from "../ui/AvatarPicker"
import './styles/ProjectSettings.css'

export default function ProjectSettings({ project }) {

  const { setPageLoading, myOrgID, setToasts, myUserID } = useContext(StoreContext)
  const projectID = useParams().projectID
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [selectedAvatar, setSelectedAvatar] = useState({ src: '' })
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectCategory, setProjectCategory] = useState('')
  const [projectKey, setProjectKey] = useState('')

  const canModifySetting = project?.accessType !== 'admin'
    || project?.admins?.includes(myUserID)
    || project?.ownerID === myUserID

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

  useEffect(() => {
    if (project) {
      setSelectedAvatar({ src: project.photoURL })
      setProjectName(project.name)
      setProjectDescription(project.description)
      setProjectCategory(project.category)
      setProjectKey(project.projectKey)
    }
  }, [project])

  return (
    <div className="project-settings">
      <div className="settings-container">
        <h5>Project Details</h5>
        <SettingsSection
          label="Project Avatar"
          sublabel="Edit the project avatar"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AvatarPicker
            label="Project Avatar"
            name="avatar-picker"
            showModal={showCoverInput === 'avatar-picker'}
            setShowModal={canModifySetting ? setShowCoverInput : null}
            avatarsList={projectAvatarsList}
            activeAvatar={selectedAvatar}
            pickerDimensions={40}
            avatarsDimensions={48}
            showUploader
            onAvatarClick={(avatar) => setSelectedAvatar(avatar)}
          />
        </SettingsSection>
        <SettingsSection
          label="Project Name"
          sublabel="Edit the project name"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppInput
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
            disabled={!canModifySetting}
          />
        </SettingsSection>
        <SettingsSection
          label="Project Key"
          sublabel="Edit the project key"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppInput
            onChange={(e) => setProjectKey(e.target.value)}
            value={projectKey}
            disabled={!canModifySetting}
          />
        </SettingsSection>
        <SettingsSection
          label="Project Description"
          sublabel="Edit the project description"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppTextarea
            onChange={(e) => setProjectDescription(e.target.value)}
            value={projectDescription}
            disabled={!canModifySetting}
          />
        </SettingsSection>
        <SettingsSection
          label="Project Category"
          sublabel="Edit the project category"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppReactSelect
            placeholder={
              <div className="input-placeholder">
                <i className={switchProjectCategory(projectCategory).icon} />
                <h5 className="cap">{projectCategory}</h5>
              </div>
            }
            options={projectCategoriesOptions}
            value={projectCategory}
            onChange={(type) => setProjectCategory(type.value)}
            disabled={!canModifySetting}
          />
        </SettingsSection>
      </div>
    </div>
  )
}
