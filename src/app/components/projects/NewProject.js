import React, { useContext, useState } from 'react'
import './styles/NewProject.css'
import newProjectImg from 'app/assets/images/new-project-trans.png'
import newProjectBlob from 'app/assets/images/new-project-blob.svg'
import { StoreContext } from "app/store/store"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import {
  projectAccessOptions, projectAvatarsList, 
  projectCategoriesOptions, projectTypeOptions,
  switchProjectAccess, switchProjectCategory, 
  switchProjectType
} from "app/data/projectsData"
import OrgUsersTagInput from "./OrgUsersTagInput"
import AppButton from "../ui/AppButton"
import { useUsers } from "app/hooks/userHooks"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import { createOrgProjectService } from "app/services/projectsServices"
import { useNavigate } from "react-router-dom"
import AvatarPicker from "../ui/AvatarPicker"

export default function NewProject() {

  const { myOrgID, myUserID, setToasts } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [projectType, setProjectType] = useState(projectTypeOptions[0].value)
  const [accessType, setAccessType] = useState(projectAccessOptions[0].value)
  const [category, setCategory] = useState(projectCategoriesOptions[0].value)
  const [invitesQuery, setInvitesQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [inviteesIDs, setInviteesIDs] = useState([])
  const [createLoading, setCreateLoading] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(projectAvatarsList[0])
  const orgAlgoliaFilters = `activeOrgID:${myOrgID} AND NOT userID:${myUserID}`
  const inviteesUsers = useUsers(inviteesIDs)
  const navigate = useNavigate()
  const nameIsNotEmpty = name.trim().length > 0

  const invitedUsersList = inviteesUsers?.map((user, index) => {
    return <div
      className="invited-user"
      key={index}
    >
      <div className="texts">
        <Avatar
          src={user?.photoURL}
          dimensions={27}
        />
        <h6>{user?.firstName} {user?.lastName}</h6>
      </div>
      <IconContainer
        icon="fal fa-times"
        onClick={() => removeInvite(user)}
        iconColor="var(--grayText)"
        iconSize={19}
        dimensions={25}
      />
    </div>
  })

  const inviteUser = (e, user) => {
    e.preventDefault()
    setInviteesIDs(prev => [...prev, user.userID])
  }

  const removeInvite = (user) => {
    setInviteesIDs(prev => prev.filter(id => id !== user.userID))
  }

  const clearInvites = () => {
    setInviteesIDs([])
  }

  const createProject = () => {
    if (!nameIsNotEmpty) return
    createOrgProjectService(
      myOrgID,
      myUserID,
      {
        accessType,
        category,
        members: [...inviteesIDs, myUserID],
        name,
        projectType,
        photoURL: selectedAvatar?.src
      },
      setToasts,
      setCreateLoading
    )
      .then((projectID) => {
        navigate(`/projects/${projectID}/backlog`)
      })
  }

  return (
    <div className="new-project-container">
      <div className="content">
        <div className="form-container">
          <h3>Create Project</h3>
          <h6>You can edit these details later in your project settings.</h6>
          <div className="form">
            <AvatarPicker
              label="Project Avatar"
              name="avatar-picker"
              showModal={showCoverInput === 'avatar-picker'}
              setShowModal={setShowCoverInput}
              avatarsList={projectAvatarsList}
              activeAvatar={projectAvatarsList[0]}
              pickerDimensions={40}
              avatarsDimensions={48}
              showUploader
              onAvatarClick={(avatar) => setSelectedAvatar(avatar)}
            />
            <AppInput
              label="Project Name *"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
            />
            <AppReactSelect
              label="Category"
              placeholder={
                <div className="input-placeholder">
                  <i className={switchProjectCategory(category).icon} />
                  <h5 className="cap">{category}</h5>
                </div>
              }
              options={projectCategoriesOptions}
              value={category}
              onChange={(type) => setCategory(type.value)}
            />
            <AppReactSelect
              label="Management Type"
              placeholder={
                <div className="input-placeholder">
                  <i className={switchProjectType(accessType).icon} />
                  <h5>{projectType === 'admin' ? 'Administrator Based' : 'Team Based'}</h5>
                </div>
              }
              options={projectTypeOptions}
              value={projectType}
              onChange={(type) => setProjectType(type.value)}
            />
            <AppReactSelect
              label="Access Rights"
              placeholder={
                <div className="input-placeholder">
                  <i className={switchProjectAccess(accessType).icon} />
                  <h5>{accessType === 'open' ? 'Open' : 'Invite Only'}</h5>
                </div>
              }
              options={projectAccessOptions}
              value={accessType}
              onChange={(type) => setAccessType(type.value)}
            />
            <OrgUsersTagInput
              label="Invite Members"
              name="invites"
              placeholder="Invite members..."
              query={invitesQuery}
              value={invitesQuery}
              onChange={(e) => setInvitesQuery(e.target.value)}
              setLoading={setSearchLoading}
              filters={orgAlgoliaFilters}
              onUserClick={(e, user) => inviteUser(e, user)}
              onUserRemove={(user) => removeInvite(user)}
              onFocus={() => setShowCoverInput('invites')}
              showDropdown={showCoverInput}
              setShowDropdown={setShowCoverInput}
              iconleft={<div className="icon"><i className="far fa-user" /></div>}
              selectedUsers={inviteesUsers}
              multiple={inviteesIDs?.length > 1}
              maxAvatars={10}
              onClear={() => clearInvites()}
              showAll={false}
              typeSearch
            />
            {
              inviteesUsers?.length > 0 &&
              <div className="invited-users-list">
                {invitedUsersList}
              </div>
            }
          </div>
          <div className="btn-group">
            <AppButton
              label="Create"
              onClick={() => createProject()}
              disabled={!nameIsNotEmpty}
              loading={createLoading}
            />
          </div>
        </div>
        <div className="art">
          <div className="blob-container">
            <img
              src={newProjectBlob}
              className="blob"
            />
            <img
              src={newProjectImg}
              alt="New Project"
              className="new-project-img"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
