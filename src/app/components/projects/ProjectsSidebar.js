import { useOrgProjects } from "app/hooks/projectsHooks"
import { StoreContext } from "app/store/store"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import Avatar from "../ui/Avatar"
import './styles/ProjectsSidebar.css'

export default function ProjectsSidebar() {

  const { myUserImg, myUserName, myUser } = useContext(StoreContext)
  const navigate = useNavigate()
  const limitsNum = 5
  const [projectsLimit, setProjectsLimit] = useState(limitsNum)
  const projects = useOrgProjects(projectsLimit)

  const projectsList = projects?.map((project, index) => {
    return <NavLink
      key={index}
      to={`/projects/${project?.projectID}`}
    >
      <span>
        {
          project?.photoURL ?
            <Avatar
              src={project?.photoURL}
              alt={project?.name}
              dimensions={22}
            /> :
            <i className="fas fa-hashtag" />
        }
        <h6>{truncateText(project?.name, 20)}</h6>
      </span>
      <i className="fas fa-arrow-right" />
    </NavLink>
  })

  return (
    <div className="projects-sidebar">
      <div className="profile-section">
        <Avatar
          src={myUserImg}
          dimensions={30}
        />
        <div className="texts">
          <h5>{myUserName}</h5>
          <h6>{myUser?.title}</h6>
        </div>
      </div>
      <div className="menu">
        <NavLink to="/projects">
          <i className="fas fa-home" />
          Home
        </NavLink>
        <NavLink to="/projects/updates">
          <i className="fas fa-clock" />
          Updates
        </NavLink>
        <NavLink to="/projects/settings">
          <i className="fas fa-sliders-v" />
          Settings
        </NavLink>
      </div>
      <div className="section">
        <h5>
          <span>Projects</span>
          <small onClick={() => navigate('/projects/new')}>
            <i className="far fa-plus" />
            New Project
          </small>
        </h5>
        <div className="all-projects-list">
          {projectsList}
        </div>
      </div>
      <div className="section">
        <h5>Tasks To Do</h5>
        {/* display tasks that are due this week from all projects (limit to 3 most recent projects) */}
      </div>
    </div>
  )
}
