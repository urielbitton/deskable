import ProjectsSidebar from "app/components/projects/ProjectsSidebar"
import ProjectsWindow from "app/components/projects/ProjectsWindow"
import AppCard from "app/components/ui/AppCard"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'
import './styles/ProjectsPage.css'

export default function ProjectsPage() {

  const { showProjectsSidebar } = useContext(StoreContext)

  useEffect(() => {
    localStorage.setItem('showProjectsSidebar', !showProjectsSidebar ? "false" : "true")  
  },[showProjectsSidebar]) 

  return (
    <AppCard 
      className={`projects-page ${!showProjectsSidebar ? 'minimized' : ''}`}
      padding="0"
      withBorder
    >
      <ProjectsSidebar />
      <ProjectsWindow />
    </AppCard>
  )
}
