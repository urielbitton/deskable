import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import AllProjects from "./AllProjects"
import NewProject from "./NewProject"
import ProjectPage from "./ProjectPage"
import ProjectsHome from "./ProjectsHome"
import ProjectsMainSettings from "./ProjectsMainSettings"
import ProjectsUpdates from "./ProjectsUpdates"
import SingleProject from "./SingleProject"
import './styles/ProjectsWindow.css'
import WritePage from "./WritePage"

export default function ProjectsWindow() {

  const [showScroll, setShowScroll] = useState(false)
  const [windowPadding, setWindowPadding] = useState('20px')

  return (
    <div 
      className={`projects-window ${showScroll ? 'show-scroll' : ''}`}
      style={{padding: windowPadding}}
    >
      <Routes>
        <Route index element={<ProjectsHome setShowScroll={setShowScroll} />} />
        <Route path=":projectID/*" element={<SingleProject />} />
        <Route path=":projectID/pages/:pageID" element={<ProjectPage setWindowPadding={setWindowPadding} />} />
        <Route path=":projectID/pages/:pageID/:editPage" element={<WritePage setWindowPadding={setWindowPadding} />} />
        <Route path=":projectID/pages/new-page" element={<WritePage setWindowPadding={setWindowPadding} />} />
        <Route path="all-projects" element={<AllProjects />} />
        <Route path="updates" element={<ProjectsUpdates />} />
        <Route path="settings" element={<ProjectsMainSettings />} />
        <Route path="new" element={<NewProject />} />
      </Routes>
    </div>
  )
}
