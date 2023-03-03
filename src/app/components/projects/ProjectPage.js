import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import TinymceReader from "../ui/TinymceReader"
import './styles/ProjectPage.css'

export default function ProjectPage() {

  const { setShowProjectsSidebar } = useContext(StoreContext)
  const projectID = useParams().projectID
  const editorRef = useRef(null)
  const navigate = useNavigate()

  const backToProject = () => {
    setShowProjectsSidebar(true)
    navigate(`/projects/${projectID}`)
  }

  useEffect(() => {
    setShowProjectsSidebar(false)
  }, [])

  return (
    <div className="project-page">
      <div className="toolbar">
        <div className="left">
          <AppButton
            label="Back to Project"
            buttonType="invertedBtn small"
            onClick={backToProject}
          />
        </div>
        <div className="right">

        </div>
      </div>
      <div className="page-content">
        <div className="editor-container">
          <TinymceReader
            editorRef={editorRef}
            editorHeight="calc(100vh - 160px)"
          />
        </div>
        <div className="page-sidebar">
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
