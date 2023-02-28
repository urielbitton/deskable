import { useAllOrgOpenProjectTasks, useOrgProjects } from "app/hooks/projectsHooks"
import React, { useState } from 'react'
import { Link } from "react-router-dom"
import AppTabsBar from "../ui/AppTabsBar"
import ProjectCard from "./ProjectCard"
import './styles/ProjectsHome.css'

export default function ProjectsHome() {

  const [tabsBarIndex, setTabsBarIndex] = useState('tasks')
  const projectsLimit = 5
  const tasksLimit = 25
  const recentProjects = useOrgProjects(projectsLimit)
  const recentOrgTasks = useAllOrgOpenProjectTasks(tasksLimit)

  const recentProjectsList = recentProjects?.map((project, index) => {
    return <ProjectCard
      key={index}
      project={project}
    />
  })

  const recentLastWeekOrgTasksList = recentOrgTasks
    ?.filter(task => task.lastActive > Date.now() - 604800000)
    .map((task, index) => {
      return <TaskRow
        key={index}
        task={task}
      />
    })

  const recentLastMonthOrgTasksList = recentOrgTasks
    ?.filter(task => task.lastActive > Date.now() - 2592000000 && task.lastActive < Date.now() - 604800000)
    .map((task, index) => {
      return <TaskRow
        key={index}
        task={task}
      />
    })

  return (
    <div className="projects-home">
      <h3>Projects</h3>
      <div className="recents-flex">
        <div className="titles">
          <h5>Recent Projects</h5>
          <Link to="all-projects">View All</Link>
        </div>
        <div className="projects-list">
          {recentProjectsList}
        </div>
      </div>
      <div className="recents-flex">
        <AppTabsBar>
          <h6
            className={`tab-item ${tabsBarIndex === 'tasks' ? 'active' : ''}`}
            onClick={() => setTabsBarIndex('tasks')}
          >
            <i className="fas fa-tasks" />
            Tasks
          </h6>
          <h6
            className={`tab-item ${tabsBarIndex === 'pages' ? 'active' : ''}`}
            onClick={() => setTabsBarIndex('pages')}
          >
            <i className="fas fa-page" />
            Pages
          </h6>
        </AppTabsBar>
        <div className="tasks-list">
          <h6>In the last week</h6>
          <div className="sub-section">
            {recentLastWeekOrgTasksList}
          </div>
          <h6>In the last month</h6>
          <div className="sub-section">
            {recentLastMonthOrgTasksList}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TaskRow(props) {

  const { title } = props.task

  return (
    <div className="home-task-row">

    </div>
  )
}