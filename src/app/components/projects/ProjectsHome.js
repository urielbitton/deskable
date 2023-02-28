import { useOrgProjects } from "app/hooks/projectsHooks"
import React from 'react'
import { Link } from "react-router-dom"
import ProjectCard from "./ProjectCard"
import './styles/ProjectsHome.css'

export default function ProjectsHome() {

  const projectsLimit = 5
  const recentProjects = useOrgProjects(projectsLimit)

  const recentProjectsList = recentProjects?.map((project, index) => {
    return <ProjectCard
      key={index}
      project={project}
    />
  })

  return (
    <div className="projects-home">
      <h3>Projects</h3>
      <div className="recent-projects-flex">
        <div className="titles">
          <h5>Recent Projects</h5>
          <Link to="all-projects">View All</Link>
        </div>
        <div className="projects-list">
          {recentProjectsList}
        </div>
      </div>
    </div>
  )
}
