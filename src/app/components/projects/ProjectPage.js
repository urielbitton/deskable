import { projectPageTemplates } from "app/data/projectsData"
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
import TinymceEditor from "../ui/TinymceEditor"
import './styles/ProjectPage.css'

export default function ProjectPage({ setWindowPadding }) {

  const { setShowProjectsSidebar } = useContext(StoreContext)
  const [title, setTitle] = useState('')
  const [showMenu, setShowMenu] = useState(null)
  const [hideSidebar, setHideSidebar] = useState(false)
  const projectID = useParams().projectID
  const pageID = useParams().pageID
  const page = useProjectPage(projectID, pageID)
  const editorRef = useRef(null)
  const navigate = useNavigate()
  const draft = localStorage.getItem(`projectPageDraft`) || ''
  const titleDraft = localStorage.getItem(`projectPageTitleDraft`) || ''
  const pageCreator = useUser(page?.creatorID)

  const pageTemplatesList = projectPageTemplates?.map((template, index) => {
    return <div
      className="template-item"
      onClick={() => insertTemplate(template.template)}
      key={index}
    >
      <div className="icon-side">
        <IconContainer
          icon={template.icon}
          bgColor={template.iconColor}
          iconColor="#fff"
          iconSize={17}
          dimensions={30}
        />
      </div>
      <div className="text-side">
        <h5>{template.name}</h5>
        <p>{template.description}</p>
      </div>
    </div>
  })

  const insertTemplate = (template) => {
    if(!editorRef.current) return
    if (editorRef.current.getContent() !== '') {
      if (!window.confirm('Are you sure you want to insert a template? This will overwrite your current content.')) {
        return
      }
    }
    editorRef.current.setContent(template.content)
    setTitle(template.title)
  }

  const backToProject = () => {
    setShowProjectsSidebar(true)
    navigate(`/projects/${projectID}`)
  }

  const previewPage = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview')
    }
  }

  const publishPage = () => {
    localStorage.removeItem(`projectPageDraft`)
    console.log('published!')
  }

  const autoSaveDraft = (value) => {
    localStorage.setItem(`projectPageDraft`, value)
  }

  const editPage = () => {

  }

  const deletePage = () => {

  }

  useEffect(() => {
    setShowProjectsSidebar(false)
    setWindowPadding('0')
    return () => setWindowPadding('20px')
  }, [])

  useEffect(() => {
    setTitle(titleDraft)
  }, [titleDraft])

  return (
    <div className="project-page">
      <div className={`page-content ${hideSidebar ? 'hide-sidebar' : ''}`}>
        <div className="editor-container">
          <div className="title-header">
            <AppInput
              placeholder="Add a page title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                localStorage.setItem(`projectPageTitleDraft`, e.target.value)
              }}
            />
          </div>
          <TinymceEditor
            editorRef={editorRef}
            editorHeight="calc(100vh - 100px)"
            customBtnOnClick={backToProject}
            customBtnLabel="Back to Project"
            onEditorChange={(value) => autoSaveDraft(value)}
            loadContent={draft}
          />
        </div>
        <div className="page-sidebar">
          <div className="sidebar-toolbar sidebar-section">
            <div className="side">
              <AppButton
                label="Publish"
                onClick={() => publishPage()}
              />
              <AppButton
                label="Invite"
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
                  { label: 'Edit Page', icon: 'fas fa-pen', onClick: () => editPage() },
                  { label: 'Delete Page', icon: 'fas fa-trash', onClick: () => deletePage() },
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
              {pageTemplatesList}
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
