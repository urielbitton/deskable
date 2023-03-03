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

export default function ProjectsWindow() {

  const [showScroll, setShowScroll] = useState(false)

  return (
    <div className={`projects-window ${showScroll ? 'show-scroll' : ''}`}>
      <Routes>
        <Route index element={<ProjectsHome setShowScroll={setShowScroll} />} />
        <Route path=":projectID/*" element={<SingleProject />} />
        <Route path=":projectID/pages/:pageID" element={<ProjectPage />} />
        <Route path="all-projects" element={<AllProjects />} />
        <Route path="updates" element={<ProjectsUpdates />} />
        <Route path="settings" element={<ProjectsMainSettings />} />
        <Route path="new" element={<NewProject />} />
      </Routes>
    </div>
  )
}
