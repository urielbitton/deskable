import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { Route, Routes } from "react-router-dom"
import AllProjects from "./AllProjects"
import NewProject from "./NewProject"
import ProjectPage from "./ProjectPage"
import ProjectsHome from "./ProjectsHome"
import ProjectsMainSettings from "./ProjectsMainSettings"
import SingleProject from "./SingleProject"
import './styles/ProjectsWindow.css'
import WritePage from "./WritePage"

export default function ProjectsWindow() {

  const { myMemberType } = useContext(StoreContext)
  const [showScroll, setShowScroll] = useState(false)
  const [windowPadding, setWindowPadding] = useState('20px')
  const canCreateProject = myMemberType === 'classa' || myMemberType === 'classb'

  return (
    <div 
      className={`projects-window ${showScroll ? 'show-scroll' : ''}`}
      style={{padding: windowPadding}}
    >
      <Routes>
        <Route index element={<ProjectsHome setShowScroll={setShowScroll} />} />
        <Route path=":projectID/*" element={<SingleProject />} />
        <Route path=":projectID/pages/:pageID" element={<ProjectPage setWindowPadding={setWindowPadding} />} />
        <Route path=":projectID/pages/:pageID/edit" element={<WritePage setWindowPadding={setWindowPadding} />} />
        <Route path=":projectID/pages/new-page" element={<WritePage setWindowPadding={setWindowPadding} />} />
        <Route path="all-projects" element={<AllProjects />} />
        <Route path="settings" element={<ProjectsMainSettings />} />
        { canCreateProject && <Route path="new" element={<NewProject />} /> }
      </Routes>
    </div>
  )
}
