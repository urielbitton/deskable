import React from 'react'
import { Route, Routes } from "react-router-dom"
import NewProject from "./NewProject"
import ProjectsHome from "./ProjectsHome"
import ProjectsSettings from "./ProjectsSettings"
import SingleProject from "./SingleProject"
import './styles/ProjectsWindow.css'

export default function ProjectsWindow() {
  return (
    <div className="projects-window">
      <Routes>
        <Route index element={<ProjectsHome />} />
        <Route path=":projectID/*" element={<SingleProject />} />
        <Route path="updates" element={<SingleProject />} />
        <Route path="settings" element={<ProjectsSettings />} />
        <Route path="new" element={<NewProject />} />
      </Routes>
    </div>
  )
}
