import React from 'react'
import { Route, Routes } from "react-router-dom"
import AllProjects from "./AllProjects"
import NewProject from "./NewProject"
import ProjectsHome from "./ProjectsHome"
import ProjectsMainSettings from "./ProjectsMainSettings"
import ProjectsUpdates from "./ProjectsUpdates"
import SingleProject from "./SingleProject"
import './styles/ProjectsWindow.css'

export default function ProjectsWindow() {
  return (
    <div className="projects-window">
      <Routes>
        <Route index element={<ProjectsHome />} />
        <Route path=":projectID/*" element={<SingleProject />} />
        <Route path="all-projects" element={<AllProjects />} />
        <Route path="updates" element={<ProjectsUpdates />} />
        <Route path="settings" element={<ProjectsMainSettings />} />
        <Route path="new" element={<NewProject />} />
      </Routes>
    </div>
  )
}
