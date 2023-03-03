import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"
import TinymceEditor from "../ui/TinymceEditor"
import './styles/ProjectPage.css'

export default function ProjectPage({ setWindowPadding }) {

  const { setShowProjectsSidebar } = useContext(StoreContext)
  const [title, setTitle] = useState('')
  const [showMenu, setShowMenu] = useState(null)
  const [hideSidebar, setHideSidebar] = useState(false)
  const projectID = useParams().projectID
  const pageID = useParams().pageID
  const editorRef = useRef(null)
  const navigate = useNavigate()

  const backToProject = () => {
    setShowProjectsSidebar(true)
    navigate(`/projects/${projectID}`)
  }

  const previewPage = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview')
    }
  }

  const editPage = () => {

  }

  const deletePage = () => {

  }

  useEffect(() => {
    setShowProjectsSidebar(false)
    setWindowPadding('0')
  }, [])

  return (
    <div className="project-page">
      <div className={`page-content ${hideSidebar ? 'hide-sidebar' : ''}`}>
        <div className="editor-container">
          <AppInput
            placeholder="Add a page title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TinymceEditor
            editorRef={editorRef}
            editorHeight="calc(100vh - 100px)"
            customBtnOnClick={backToProject}
            customBtnLabel="Back to Project"
          />
        </div>
        <div className="page-sidebar">
          <div className="sidebar-toolbar">
            <div className="side">
              <AppButton
                label="Publish"
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
                tooltip="Toggle Sidebar"
                dimensions={25}
                inverted
                iconSize="15px"
                onClick={() => setHideSidebar(prev => !prev)}
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
          <div className="page-info">
            <div className="titles">
              <h5>Page Info</h5>
            </div>
            <div className="page-info-content">

            </div>
          </div>
          <div className="page-templates">
            <div className="titles">
              <h5>Templates</h5>
            </div>
            <div className="page-templates-content">

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
