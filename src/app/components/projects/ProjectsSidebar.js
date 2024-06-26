import { useOrgProjects } from "app/hooks/projectsHooks"
import { StoreContext } from "app/store/store"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { NavLink, useLocation } from "react-router-dom"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import './styles/ProjectsSidebar.css'

export default function ProjectsSidebar() {

  const { myUserImg, myUserName, myUser, showProjectsSidebar,
    setShowProjectsSidebar, myMemberType } = useContext(StoreContext)
  const location = useLocation()
  const projectsLimit = 5
  const projects = useOrgProjects(projectsLimit)
  const canCreateProject = myMemberType === 'classa' || myMemberType === 'classb'

  const projectsList = projects?.map((project, index) => {
    return <NavLink
      key={index}
      to={project.activeSprintID ? `/projects/${project?.projectID}/board` : `/projects/${project?.projectID}/backlog`}
      title={!showProjectsSidebar && project?.name}
      className={location.pathname.includes(project?.projectID) ? 'active' : 'not-active'}
    >
      <span>
        <i className="fas fa-hashtag" />
        <h6>{showProjectsSidebar ? truncateText(project?.name, 20) : `${project?.name?.slice(0, 2)}`}</h6>
      </span>
      <i className="fas fa-arrow-right" />
    </NavLink>
  })

  return (
    <div className={`projects-sidebar ${!showProjectsSidebar ? 'minimized' : ''}`}>
      <IconContainer
        icon="fas fa-grip-lines-vertical"
        inverted
        iconColor="var(--grayText)"
        iconSize="15px"
        dimensions="25px"
        tooltip={showProjectsSidebar ? 'Hide Projects Sidebar' : 'Show Projects Sidebar'}
        onClick={() => setShowProjectsSidebar(prev => !prev)}
        className="toggle-icon"
      />
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
        <NavLink
          to="/projects"
          className={location.pathname === '/projects' ? 'active' : 'not-active'}
        >
          <i className="fas fa-th-large" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects/all-projects">
          <i className="fas fa-project-diagram" />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/projects/settings">
          <i className="fas fa-sliders-v" />
          <span>Settings</span>
        </NavLink>
        {
          canCreateProject &&
          <NavLink to="/projects/new">
            <i className="fas fa-plus" />
            <span>New Project</span>
          </NavLink>
        }
      </div>
      <div className="section section-projects">
        <h5>
          <span>Projects</span>
        </h5>
        <div className="all-projects-list">
          {projectsList}
        </div>
      </div>
    </div>
  )
}
