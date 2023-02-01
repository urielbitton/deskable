import ProjectsSidebar from "app/components/projects/ProjectsSidebar"
import ProjectsWindow from "app/components/projects/ProjectsWindow"
import AppCard from "app/components/ui/AppCard"
import React from 'react'
import './styles/ProjectsPage.css'

export default function ProjectsPage() {
  return (
    <AppCard 
      className="projects-page"
      padding="0"
      withBorder
    >
      <ProjectsSidebar />
      <ProjectsWindow />
    </AppCard>
  )
}
