import { Editor } from "@tinymce/tinymce-react"
import { useProjectPage } from "app/hooks/projectsHooks"
import useUser from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AppBadge from "../ui/AppBadge"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import './styles/ProjectPage.css'

const tinymceAPIKey = process.env.REACT_APP_TINYMCEKEY

export default function ProjectPage({ setWindowPadding }) {

  const { setShowProjectsSidebar, setPageLoading } = useContext(StoreContext)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showMenu, setShowMenu] = useState(null)
  const [hideSidebar, setHideSidebar] = useState(false)
  const projectID = useParams().projectID
  const pageID = useParams().pageID
  const page = useProjectPage(projectID, pageID)
  const pageCreator = useUser(page?.creatorID)
  const navigate = useNavigate()
  const editorRef = useRef(null)

  const triggerEditPage = () => {
    setPageLoading(true)
    const timeDelay = Math.floor(Math.random() * 500) + 500
    return new Promise((resolve) => {
      setTimeout(resolve, timeDelay)
    })
      .then(() => {
        setPageLoading(false)
        navigate(`/projects/${projectID}/pages/${pageID}/:editPage`)
      })
      .catch(err => setPageLoading(false))
  }

  useEffect(() => {
    setShowProjectsSidebar(false)
    setWindowPadding('0')
    return () => setWindowPadding('20px')
  }, [])

  useEffect(() => {
    setTitle(page?.title)
    setContent(page?.content)
  }, [page])

  return (
    <div className="project-page read-project-page">
      <div className={`page-content ${hideSidebar ? 'hide-sidebar' : ''}`}>
        <div className="editor-container">
          <div className="title-header">
            <h3>{title}</h3>
          </div>
          <div className="read-content">
            <Editor
              apiKey={tinymceAPIKey}
              ref={editorRef}
              init={{
                readonly: true,
                menubar: false,
                statusbar: false,
                toolbar: false,
                contenteditable: false,
              }}
              value={content}
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
                onClick={() => console.log('invite')}
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
                  { label: 'Invite', icon: 'fas fa-user-plus', onClick: () => console.log('Invite') },
                ]}
                onClick={() => setShowMenu(prev => prev !== pageID ? pageID : null)}
              />
            </div>
          </div>
          <div className="page-info sidebar-section">
            <div className="titles">
              <h5>Page Info</h5>
              <AppBadge
                label={page?.type}
                className="cap"
              />
            </div>
            <div className="page-info-content">
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
                <AppBadge
                  label={page?.status}
                  bgColor="var(--storyBlue)"
                  color="#fff"
                  className="cap"
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
          <div className="page-templates sidebar-section">
            <div className="titles">
              <h5>Templates</h5>
            </div>
            <div className="page-templates-content">
              <AppInput
                placeholder="Search Templates"
                iconright={<i className="far fa-search" />}
              />
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
    </div>
  )
}
