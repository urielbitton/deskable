import {
  projectAvatarsList, projectCategoriesOptions,
  switchProjectType,
  switchProjectCategory,
  projectTypeOptions,
  switchProjectAccess,
  projectAccessOptions
} from "app/data/projectsData"
import { infoToast } from "app/data/toastsTemplates"
import { useUsers } from "app/hooks/userHooks"
import {
  acceptProjectRequestService, cancelOrgProjectInvitationService,
  declineProjectRequestService, deleteOrgProjectService,
  removeProjectMemberService,
  updateOrgProjectService
} from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import SettingsSection from "../settings/SettingsSection"
import AppButton from "../ui/AppButton"
import { AppInput, AppReactSelect, AppTextarea } from "../ui/AppInputs"
import AvatarPicker from "../ui/AvatarPicker"
import IconContainer from "../ui/IconContainer"
import OrgUsersTagInput from "./OrgUsersTagInput"
import { InvitedUser } from "./SingleProject"
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
  const [projectType, setProjectType] = useState('')
  const [accessType, setAccessType] = useState('')
  const [invitesQuery, setInvitesQuery] = useState('')
  const [inviteesIDs, setInviteesIDs] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [projectInvitees, setProjectInvitees] = useState([])
  const [projectRequests, setProjectRequests] = useState([])
  const [deleteString, setDeleteString] = useState('')
  const usersFilters = `activeOrgID:${myOrgID} AND NOT userID:${myUserID} AND NOT ` +
    `${project?.members?.map(member => `userID:${member}`).join(' AND NOT ')}`
  const invitedUsers = useUsers(inviteesIDs)
  const projectInvitedUsers = useUsers(projectInvitees)
  const projectRequestsUsers = useUsers(projectRequests)
  const projectMembersUsers = useUsers(project?.members)
  const projectPath = `organizations/${myOrgID}/projects`
  const navigate = useNavigate()
  const canDelete = project?.ownerID === myUserID && deleteString === 'DELETE'

  const canModifySetting = (project?.accessType === 'open' && project?.projectType !== 'admin')
    || project?.admins?.includes(myUserID)
    || project?.ownerID === myUserID

  const canSaveDetails = projectName !== project?.name
    || projectDescription !== project?.description
    || projectCategory !== project?.category
    || projectKey !== project?.projectKey
    || selectedAvatar.src !== project?.photoURL

  const canSaveAccess = projectType !== project?.projectType
    || accessType !== project?.accessType


  const cancelInvitation = (user) => {
    if (!canModifySetting) return setToasts(infoToast(`You don't have permission to cancel this invitation.`))
    cancelOrgProjectInvitationService(
      myOrgID,
      project,
      user.userID,
      setToasts,
      setPageLoading
    )
  }

  const acceptRequest = (user) => {
    if (!canModifySetting) return setToasts(infoToast(`You don't have permission to accept this request.`))
    acceptProjectRequestService(
      projectPath,
      user?.userID,
      project,
      setToasts,
      setPageLoading
    )
  }

  const declineRequest = (user) => {
    if (!canModifySetting) return setToasts(infoToast(`You don't have permission to decline this request.`))
    declineProjectRequestService(
      projectPath,
      user?.userID,
      project,
      setToasts,
      setPageLoading
    )
  }

  const removeMember = (user) => {
    if (!canModifySetting && user.userID !== myUserID) return setToasts(infoToast(`You don't have permission to remove this member.`))
    const confirm = window.confirm(`Are you sure you want to remove this user from this project?`)
    if (user?.userID === myUserID) return setToasts(infoToast(`You can't remove yourself from a project when you are the project ` +
      `owner. Please transfer the project ownership first.`))
    if (!confirm) return
    removeProjectMemberService(
      projectPath,
      user.userID,
      project,
      setToasts,
      setPageLoading
    )
  }

  const invitedUsersList = invitedUsers?.map((user, index) => {
    return <InvitedUser
      key={index}
      user={user}
      action={
        <IconContainer
          icon="fal fa-times"
          onClick={() => setInviteesIDs(inviteesIDs.filter(id => id !== user?.userID))}
          iconColor="var(--grayText)"
          iconSize={14}
          dimensions={25}
        />
      }
    />
  })

  const projectInvitedUsersList = projectInvitedUsers?.map((user, index) => {
    return <InvitedUser
      key={index}
      user={user}
      action={
        <AppButton
          label="Cancel Invitation"
          buttonType="invertedBtn small"
          onClick={() => cancelInvitation(user)}
        />
      }
    />
  })

  const projectMembersList = projectMembersUsers?.map((member, index) => {
    return <InvitedUser
      key={index}
      user={member}
      action={
        <AppButton
          label="Remove"
          buttonType="invertedBtn small"
          onClick={() => removeMember(member)}
        />
      }
    />
  })

  const projectRequestUsersList = projectRequestsUsers?.map((user, index) => {
    return <InvitedUser
      key={index}
      user={user}
      action={
        <div className="action">
          <AppButton
            label="Accept"
            buttonType="invertedBtn small"
            onClick={() => acceptRequest(user)}
          />
          <AppButton
            label="Decline"
            buttonType="invertedBtn small"
            onClick={() => declineRequest(user)}
          />
        </div>
      }
    />
  })

  const updateProject = (part) => {
    if (!canModifySetting) return setToasts(infoToast(`You don't have permission to update this project.`))
    setPageLoading(true)
    if (part === 'details') {
      updateOrgProjectService(
        myOrgID,
        projectID,
        {
          name: projectName,
          description: projectDescription,
          category: projectCategory,
          projectKey,
          photoURL: selectedAvatar.src
        },
        setToasts,
        setPageLoading
      )
    }
    if (part === 'access') {
      updateOrgProjectService(
        myOrgID,
        projectID,
        {
          projectType,
          accessType
        },
        setToasts,
        setPageLoading
      )
    }
  }

  const deleteProject = () => {
    if (!canDelete) return setToasts(infoToast(`You don't have permission to delete this project.`))
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
      .then(() => {
        navigate('/projects')
      })
  }

  useEffect(() => {
    if (project) {
      setSelectedAvatar({ src: project.photoURL })
      setProjectName(project.name)
      setProjectDescription(project.description)
      setProjectCategory(project.category)
      setProjectKey(project.projectKey)
      setProjectType(project.projectType)
      setAccessType(project.accessType)
      setProjectInvitees(project.invitations)
      setProjectRequests(project.requests)
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
            maxLength={30}
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
            maxLength={3}
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
        <div className="btn-group">
          <AppButton
            label="Save Changes"
            onClick={() => updateProject('details')}
            disabled={!canSaveDetails}
          />
        </div>
      </div>
      <div className="settings-container">
        <h5>Project Access</h5>
        <SettingsSection
          label={`Project Members (${project?.members?.length})`}
          sublabel="Members that have access to this project"
        >
          {
            project?.members?.length > 0 &&
            <div className="project-members-list invited-users-list">
              {projectMembersList}
            </div>
          }
        </SettingsSection>
        <SettingsSection
          label={`Project Access Requests (${project?.requests?.length || 0})`}
          sublabel="Users that have requested access to this project"
        >
          {
            projectRequests?.length > 0 &&
            <div className="project-requests-list invited-users-list">
              {projectRequestUsersList}
            </div>
          }
        </SettingsSection>
        <SettingsSection
          label="Invite Members"
          sublabel="Invite members to the project"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <div className="invite-members-container">
            <OrgUsersTagInput
              label="Search for members to invite to the project"
              name="invites"
              placeholder="Invite members..."
              query={invitesQuery}
              value={invitesQuery}
              onChange={(e) => setInvitesQuery(e.target.value)}
              setLoading={setSearchLoading}
              filters={usersFilters}
              onUserClick={(e, user) => {
                setInviteesIDs([...inviteesIDs, user.userID])
                setInvitesQuery('')
              }}
              onUserRemove={(user) => setInviteesIDs(prev => prev.filter(id => id !== user.userID))}
              onFocus={() => setShowCoverInput('invites')}
              showDropdown={showCoverInput}
              setShowDropdown={setShowCoverInput}
              iconleft={<div className="icon"><i className="far fa-user" /></div>}
              selectedUsers={[...invitedUsers, ...projectInvitedUsers]}
              multiple={inviteesIDs?.length > 1}
              maxAvatars={10}
              onClear={() => setInviteesIDs([])}
              showAll={false}
              typeSearch
              showUserEmails
            />
            {
              invitedUsers?.length > 0 &&
              <div className="invited-users-flex">
                <h5>Invited Users</h5>
                <div className="invited-users-list">
                  {invitedUsersList}
                </div>
              </div>
            }
            {
              projectInvitedUsers?.length > 0 &&
              <div className="invited-users-flex">
                <h5>Previously Invited Users</h5>
                <div className="invited-users-list">
                  {projectInvitedUsersList}
                </div>
              </div>
            }
          </div>
        </SettingsSection>
        <SettingsSection
          label="Management Type"
          sublabel="Edit the project management type"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppReactSelect
            placeholder={
              <div className="input-placeholder">
                <i className={switchProjectType(projectType).icon} />
                <h5>{projectType === 'admin' ? 'Administrator Based' : 'Team Based'}</h5>
              </div>
            }
            options={projectTypeOptions}
            value={projectType}
            onChange={(type) => setProjectType(type.value)}
            disabled={!canModifySetting}
          />
        </SettingsSection>
        <SettingsSection
          label="Project Access Rights"
          sublabel="Edit the project access rights"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppReactSelect
            placeholder={
              <div className="input-placeholder">
                <i className={switchProjectAccess(accessType).icon} />
                <h5>{accessType === 'open' ? 'Open' : 'Invite Only'}</h5>
              </div>
            }
            options={projectAccessOptions}
            value={accessType}
            onChange={(type) => setAccessType(type.value)}
            disabled={!canModifySetting}
          />
        </SettingsSection>
        <SettingsSection
          label="Delete Project"
          sublabel="Delete the project"
          hasAccess={canDelete}
          badge="Project Owner"
          badgeIcon="fas fa-lock"
        >
          <AppInput
            placeholder="Type DELETE to confirm"
            onChange={(e) => setDeleteString(e.target.value)}
            value={deleteString}
          />
          {
            canDelete &&
            <AppButton
              label="Delete Project"
              onClick={() => deleteProject()}
              disabled={!canDelete}
            />
          }
        </SettingsSection>
        <div className="btn-group">
          <AppButton
            label="Save Changes"
            onClick={() => updateProject('access')}
            disabled={!canSaveAccess}
          />
        </div>
      </div >
    </div >
  )
}
