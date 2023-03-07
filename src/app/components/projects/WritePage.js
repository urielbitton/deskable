import { projectPageTemplates } from "app/data/projectPageTemplates"
import { infoToast } from "app/data/toastsTemplates"
import { useOrgProject, useProjectPage } from "app/hooks/projectsHooks"
import useUser from "app/hooks/userHooks"
import { newPublishProjectPageService, updatePublishProjectPageService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import AppBadge from "../ui/AppBadge"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import PreventTabClose from "../ui/PreventTabClose"
import AskProjectAccess from "./AskProjectAccess"
import './styles/ProjectPage.css'
import PageEditor from "../ui/PageEditor"

export default function WritePage({ setWindowPadding }) {

  const { setShowProjectsSidebar, setToasts, setPageLoading,
    myUserID, myOrgID } = useContext(StoreContext)
  const [editTitle, setEditTitle] = useState('')
  const [showMenu, setShowMenu] = useState(null)
  const [hideSidebar, setHideSidebar] = useState(false)
  const [templatesSearchString, setTemplatesSearchString] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const projectID = useParams().projectID
  const project = useOrgProject(projectID)
  const pageID = useParams().pageID
  const editMode = searchParams.get('edit') === 'true'
  const page = useProjectPage(projectID, pageID)
  const editorRef = useRef(null)
  const navigate = useNavigate()
  const content = editMode ? page?.content : localStorage.getItem(`projectPageDraft`) || ''
  const contentTitle = editMode ? page?.title : localStorage.getItem(`projectPageTitleDraft`) || ''
  const pageCreator = useUser(page?.creatorID)
  const preventPageClose = page?.content !== localStorage.getItem(`projectPageTitleDraft`) || editTitle?.length > 0
  const userIsMember = project?.members?.includes(myUserID)

  const pageTemplatesList = projectPageTemplates
    ?.filter(template => {
      return template.name.toLowerCase().includes(templatesSearchString.toLowerCase()) ||
        template.description.toLowerCase().includes(templatesSearchString.toLowerCase())
    })
    .map((template, index) => {
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
    if (!editorRef.current) return
    if (editorRef.current.getContent() !== '' || editTitle !== '') {
      if (!window.confirm('Are you sure you want to insert a template? This will overwrite your current content.')) {
        return
      }
    }
    editorRef.current.setContent(template.content)
    setEditTitle(template.title)
    localStorage.setItem(`projectPageTitleDraft`, template.title)
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

  const afterPagePublish = (pageID) => {
    navigate(`/projects/${projectID}/pages/${pageID}`)
    localStorage.removeItem(`projectPageDraft`)
    localStorage.removeItem(`projectPageTitleDraft`)
  }

  const publishPage = () => {
    if (!editorRef.current.getContent() || !editTitle)
      return setToasts(infoToast('Please add a title and content to your page before publishing.'))
    const pageSize = new Blob([editorRef.current.getContent()], { type: 'text/plain' }).size
    const path = `organizations/${myOrgID}/projects/${projectID}/pages`
    if (pageSize <= 999990) {
      if (editMode) {
        updatePublishProjectPageService(
          path,
          pageID,
          editTitle,
          editorRef.current.getContent(),
          setToasts,
          setPageLoading
        )
          .then(() => {
            afterPagePublish(pageID)
          })
      }
      else {
        newPublishProjectPageService(
          path,
          myUserID,
          editTitle,
          editorRef.current.getContent(),
          setToasts,
          setPageLoading
        )
          .then((docID) => {
            afterPagePublish(docID)
          })
      }
    }
  }

  const autoSaveDraft = (value) => {
    localStorage.setItem(`projectPageDraft`, value)
  }

  const editPage = () => {

  }

  const triggerCancelEdit = () => {
    const timeDelay = Math.floor(Math.random() * 500) + 500
    if (window.confirm('Are you sure you want to cancel editing this page?')) {
      setPageLoading(true)
      return new Promise((resolve) => {
        setTimeout(resolve, timeDelay)
      })
        .then(() => {
          setPageLoading(false)
          navigate(editMode ? `/projects/${projectID}/pages/${pageID}` : `/projects/${projectID}/pages`)
        })
        .catch(err => setPageLoading(false))
    }
  }

  const deletePage = () => {

  }

  const inviteEditors = () => {

  }

  useEffect(() => {
    setShowProjectsSidebar(false)
    setWindowPadding('0')
    return () => setWindowPadding('20px')
  }, [])

  useEffect(() => {
    setEditTitle(contentTitle)
  }, [contentTitle])

  return userIsMember ? (
    <div className="project-page edit-project-page">
      <div className={`page-content ${hideSidebar ? 'hide-sidebar' : ''}`}>
        <div className="editor-container">
          <div className="title-header">
            <AppInput
              placeholder="Add a page title"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value)
                localStorage.setItem(`projectPageTitleDraft`, e.target.value)
              }}
            />
          </div>
          <PageEditor
            editorRef={editorRef}
            editorHeight="calc(100vh - 100px)"
            customBtnOnClick={backToProject}
            customBtnLabel="Back to Project"
            onEditorChange={(value) => autoSaveDraft(value)}
            loadContent={content}
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
                label="Cancel"
                onClick={() => triggerCancelEdit()}
                buttonType="invertedBtn"
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
                  ...(editMode ? [{ label: 'Invite Editors', icon: 'fas fa-user-plus', onClick: () => inviteEditors() }] : []),
                  ...(editMode ? [{ label: 'Delete Page', icon: 'fas fa-trash', onClick: () => deletePage() }] : []),
                ]}
                onClick={() => setShowMenu(prev => prev !== pageID ? pageID : null)}
              />
            </div>
          </div>
          <div
            className="page-info sidebar-section"
            style={{ display: editMode ? 'block' : 'none' }}
          >
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
                iconright={!templatesSearchString.length ?
                  <i className="far fa-search" /> :
                  <i
                    className="fal fa-times"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTemplatesSearchString('')}
                  />
                }
                onChange={(e) => setTemplatesSearchString(e.target.value)}
                value={templatesSearchString}
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
      <PreventTabClose
        preventClose={preventPageClose}
        warningMessage="Are you sure you want to leave this page? Your changes will be saved as a draft."
      />
    </div>
  ) :
    <AskProjectAccess />
}
