import { Editor } from "@tinymce/tinymce-react"
import { projectPageStatusOptions, projectPagesTypesOptions } from "app/data/projectsData"
import { infoToast } from "app/data/toastsTemplates"
import { useOrgProject, useProjectPage } from "app/hooks/projectsHooks"
import useUser, { useUsers } from "app/hooks/userHooks"
import { projectPageInviteMembersService, updateProjectPageService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { AppBadgeSelect } from "../ui/AppBadge"
import AppButton from "../ui/AppButton"
import AppModal from "../ui/AppModal"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import AskProjectAccess from "./AskProjectAccess"
import OrgUsersTagInput from "./OrgUsersTagInput"
import './styles/ProjectPage.css'

export default function ProjectPage({ setWindowPadding }) {

  const { setShowProjectsSidebar, setPageLoading, myUserID,
    tinymceAPIKey, setToasts, myOrgID, myUser } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const [hideSidebar, setHideSidebar] = useState(false)
  const projectID = useParams().projectID
  const pageID = useParams().pageID
  const project = useOrgProject(projectID)
  const page = useProjectPage(projectID, pageID)
  const pageCreator = useUser(page?.creatorID)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteesIDs, setInviteesIDs] = useState([])
  const [inviteLoading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [invitesQuery, setInvitesQuery] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const invitedUsers = useUsers(inviteesIDs)
  const userIsMember = project?.members?.includes(myUserID)
  const pagePath = `organizations/${myOrgID}/projects/${projectID}/pages`
  const usersFilters = `activeOrgID:${myOrgID} AND NOT userID:${myUserID}`

  const invitedUsersList = invitedUsers?.map((user, index) => {
    return <div
      className="invited-user"
      key={index}
    >
      <div className="texts">
        <Avatar
          src={user?.photoURL}
          dimensions={25}
        />
        <h6>{user?.firstName} {user?.lastName}</h6>
      </div>
      <IconContainer
        icon="fal fa-times"
        onClick={() => setInviteesIDs(inviteesIDs.filter(id => id !== user?.userID))}
        iconColor="var(--grayText)"
        iconSize={14}
        dimensions={25}
      />
    </div>
  })

  const triggerEditPage = () => {
    setPageLoading(true)
    const timeDelay = Math.floor(Math.random() * 500) + 500
    return new Promise((resolve) => {
      setTimeout(resolve, timeDelay)
    })
      .then(() => {
        setPageLoading(false)
        navigate(`/projects/${projectID}/pages/${pageID}/edit?edit=true`)
      })
      .catch(err => setPageLoading(false))
  }

  const previewPage = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview')
    }
  }

  const exportToWord = () => {

  }

  const updatePageSingleValue = (key, value) => {
    updateProjectPageService(
      pagePath,
      pageID,
      { [key]: value },
      setToasts,
      setUpdateLoading
    )
      .then(() => {
        setShowMenu(null)
      })
  }

  const closeInviteModal = () => {
    setShowInviteModal(false)
    setInviteesIDs([])
    setInvitesQuery('')
  }

  const inviteMembers = () => {
    if (!inviteesIDs.length) return setToasts(infoToast('Please select at least one user to invite.'))
    projectPageInviteMembersService(
      pagePath, 
      page, 
      inviteesIDs, 
      `${myUser?.firstName} ${myUser?.lastName}`, 
      setToasts, 
      setLoading
    )
    .then(() => closeInviteModal())
  }

  const cancelInvitation = () => {

  }

  useEffect(() => {
    setShowProjectsSidebar(false)
    setWindowPadding('0')
    return () => setWindowPadding('20px')
  }, [])

  return page && userIsMember ? (
    <div className="project-page read-project-page">
      <div className={`page-content ${hideSidebar ? 'hide-sidebar' : ''}`}>
        <div className="editor-container">
          <div className="read-content">
            <Editor
              apiKey={tinymceAPIKey}
              onInit={(evt, editor) => editorRef.current = editor}
              init={{
                menubar: false,
                statusbar: false,
                toolbar: false,
                height: 'calc(100vh - 80px)',
              }}
              value={page?.content}
              disabled
            />
          </div>
        </div>
        <div className="page-sidebar">
          <div className="sidebar-toolbar sidebar-section">
            <div className="side">
              <AppButton
                label="Edit Page"
                onClick={() => triggerEditPage()}
              />
              <AppButton
                label="Invite"
                onClick={() => setShowInviteModal(true)}
                buttonType="invertedGrayBtn"
              />
            </div>
            <div className="side">
              <IconContainer
                icon="fas fa-grip-lines-vertical"
                iconColor="var(--darkGrayText)"
                tooltip="Hide Sidebar"
                dimensions={25}
                inverted
                iconSize="15px"
                onClick={() => setHideSidebar(true)}
              />
              <DropdownIcon
                icon="far fa-ellipsis-h"
                iconSize={19}
                iconColor="var(--darkGrayText)"
                dimensions={27}
                round
                showMenu={showMenu === pageID}
                setShowMenu={setShowMenu}
                items={[
                  { label: 'Preview Page', icon: 'fas fa-eye', onClick: () => previewPage() },
                ]}
                onClick={() => setShowMenu(prev => prev !== pageID ? pageID : null)}
              />
            </div>
          </div>
          <div className="page-info sidebar-section">
            <div className="titles">
              <h5>Page Info</h5>
              <AppBadgeSelect
                label={page?.type}
                className="cap"
                icon={updateLoading ? 'fas fa-spinner fa-spin' : 'fas fa-pen'}
                iconSize={12}
                options={projectPagesTypesOptions}
                open={showMenu === 'pageType'}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(prev => prev !== 'pageType' ? 'pageType' : null)
                }}
                onOptionsClick={(e, option) => {
                  e.stopPropagation()
                  updatePageSingleValue('type', option.label)
                }}
              />
            </div>
            <div className="page-info-content">
              <div className="page-info-item title">
                <h6>Page Title</h6>
                <span>{page?.title}</span>
              </div>
              <div className="page-info-item">
                <h6>Created By</h6>
                <div className="creator">
                  <Avatar
                    src={pageCreator?.photoURL}
                    dimensions={25}
                    alt={pageCreator?.firstName + ' ' + pageCreator?.lastName}
                  />
                  <span>{pageCreator?.firstName + ' ' + pageCreator?.lastName}</span>
                </div>
              </div>
              <div className="page-info-item">
                <h6>Editors</h6>
                <MultipleUsersAvatars
                  userIDs={page?.editorsIDs}
                  maxAvatars={4}
                  avatarDimensions={27}
                />
              </div>
              <div className="page-info-item">
                <h6>Status</h6>
                <AppBadgeSelect
                  label={page?.status}
                  className="cap"
                  bgColor="var(--storyBlue)"
                  color="#fff"
                  icon={updateLoading ? 'fas fa-spinner fa-spin' : 'fas fa-pen'}
                  iconSize={12}
                  options={projectPageStatusOptions}
                  open={showMenu === 'pageStatus'}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(prev => prev !== 'pageStatus' ? 'pageStatus' : null)
                  }}
                  onOptionsClick={(e, option) => {
                    e.stopPropagation()
                    updatePageSingleValue('status', option.label)
                  }}
                />
              </div>
              <div className="page-info-item">
                <h6>Created On</h6>
                <span>{convertClassicDate(page?.dateCreated?.toDate())}</span>
              </div>
              <div className="page-info-item">
                <h6>Last Modified</h6>
                <span>{convertClassicDate(page?.dateModified?.toDate())}</span>
              </div>
            </div>
          </div>
          <div className="page-exports sidebar-section">
            <div className="titles">
              <h5>Export Page</h5>
            </div>
            <div className="page-export-content">
              <div className="page-info-item">
                <h6>Export to PDF</h6>
                <AppButton
                  label="Export PDF"
                  leftIcon="fas fa-file-pdf"
                  onClick={() => console.log('export pdf')}
                />
              </div>
              <div className="page-info-item">
                <h6>Export to Word</h6>
                <AppButton
                  label="Export Word"
                  leftIcon="fas fa-file-word"
                  onClick={() => exportToWord()}
                />
              </div>
            </div>
          </div>
          {
            hideSidebar &&
            <div className="folded-sidebar">
              <IconContainer
                icon="fas fa-grip-lines-vertical"
                iconColor="var(--darkGrayText)"
                tooltip="Show Sidebar"
                dimensions={27}
                inverted
                iconSize={16}
                onClick={() => setHideSidebar(false)}
                className="toggle-sidebar-icon"
              />
            </div>
          }
        </div>
      </div>
      <AppModal
        showModal={showInviteModal}
        setShowModal={setShowInviteModal}
        label="Invite Members"
        portalClassName="invite-members-modal"
        onClose={() => closeInviteModal()}
        actions={<>
          <AppButton
            label={`Invite ${inviteesIDs.length > 0 ? inviteesIDs.length : ''} Member${inviteesIDs.length !== 1 ? 's' : ''}`}
            onClick={() => inviteMembers()}
            loading={inviteLoading}
            disabled={inviteesIDs.length < 1}
          />
          <AppButton
            label="Cancel"
            buttonType="outlineBtn"
            onClick={() => closeInviteModal()}
          />
        </>}
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
            selectedUsers={invitedUsers}
            multiple={inviteesIDs?.length > 1}
            maxAvatars={10}
            onClear={() => setInviteesIDs([])}
            showAll={false}
            typeSearch
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
        </div>
      </AppModal>
    </div>
  ) :
    page && !userIsMember ? (
      <AskProjectAccess />
    ) :
      <div className="project-page-loader">
        <i className="fal fa-spinner fa-spin" />
      </div>
}
