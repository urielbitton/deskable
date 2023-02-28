import { recentTasksSortByOptions, recentTasksSortBySwitch, 
  switchTaskPriority, switchTaskType } from "app/data/projectsData"
import { useAllOrgOpenProjectTasks, useOrgProjects } from "app/hooks/projectsHooks"
import { getTimeAgo } from "app/utils/dateUtils"
import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import { AppReactSelect } from "../ui/AppInputs"
import AppScrollSlider from "../ui/AppScrollSlider"
import AppTabsBar from "../ui/AppTabsBar"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import ProjectCard from "./ProjectCard"
import './styles/ProjectsHome.css'

export default function ProjectsHome({ setShowScroll }) {

  const [tabsBarIndex, setTabsBarIndex] = useState('tasks')
  const [sortBy, setSortBy] = useState(recentTasksSortByOptions[0].value)
  const projectsLimit = 5
  const tasksLimit = 25
  const recentProjects = useOrgProjects(projectsLimit)
  const recentOrgTasks = useAllOrgOpenProjectTasks(tasksLimit, sortBy)
  const projectsSliderRef = useRef(null)

  const recentProjectsList = recentProjects?.map((project, index) => {
    return <ProjectCard
      key={index}
      project={project}
    />
  })

  const recentLastWeekOrgTasksList = recentOrgTasks
    ?.filter(task => task.dateModified?.toDate() > Date.now() - 604800000)
    .map((task, index) => {
      return <TaskRow
        key={index}
        task={task}
      />
    })

  const recentLastMonthOrgTasksList = recentOrgTasks
    ?.filter(task => task.dateModified?.toDate() > Date.now() - 2592000000 && task.dateModified?.toDate() < Date.now() - 604800000)
    .map((task, index) => {
      return <TaskRow
        key={index}
        task={task}
      />
    })

  useEffect(() => {
    setShowScroll(true)
    return () => setShowScroll(false)
  }, [])

  return (
    <div className="projects-home">
      <h3>Projects</h3>
      <div className="recents-flex">
        <div className="titles">
          <h5>Recent Projects</h5>
          <Link to="all-projects">View All</Link>
        </div>
        <div className="projects-list">
          <AppScrollSlider
            scrollAmount={260}
            innerRef={projectsSliderRef}
            fadeEnd="50px"
            hideArrows
          >
            {recentProjectsList}
          </AppScrollSlider>
        </div>
      </div>
      <div className="recents-flex">
        <AppTabsBar
          noSpread
          spacedOut={10}
          sticky
        >
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
        <div className={`tab-section ${tabsBarIndex === 'tasks' ? 'active' : ''}`}>
          <div className="tasks-list">
            <div className="title-row">
              <h6>In the last week</h6>
              <AppReactSelect
                label="Sort By"
                options={recentTasksSortByOptions}
                onChange={(option) => setSortBy(option.value)}
                value={sortBy}
                placeholder={
                  <h5 className="placeholder">
                    <i className={recentTasksSortBySwitch(sortBy).icon} />
                    {recentTasksSortBySwitch(sortBy).name}
                  </h5>
                }
              />
            </div>
            <div className="sub-section">
              {recentLastWeekOrgTasksList}
            </div>
            <div className="title-row">
              <h6>In the last month</h6>
            </div>
            <div className="sub-section">
              {recentLastMonthOrgTasksList}
            </div>
          </div>
        </div>
        <div className={`tab-section ${tabsBarIndex === 'pages' ? 'active' : ''}`}>
          <div className="tasks-list">
            <h6>In the last week</h6>
            <div className="sub-section">

            </div>
            <h6>In the last month</h6>
            <div className="sub-section">

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TaskRow(props) {

  const { title, taskType, taskNum, priority,
    assigneesIDs, dateModified, points, projectID,
    taskID } = props.task

  return (
    <Link 
      className="home-task-row"
      to={`/projects/${projectID}/backlog?taskID=${taskID}`}
    >
      <div className="texts">
        <div className="task-title item">
          <IconContainer
            icon={switchTaskType(taskType).icon}
            iconColor="#fff"
            iconSize={11}
            bgColor={switchTaskType(taskType).color}
            dimensions={19}
            round={false}
          />
          <div className="right">
            <h6>{title}</h6>
            <small>{taskNum}</small>
          </div>
        </div>
        <small className="item">
          <i
            className={switchTaskPriority(priority).icon}
            style={{ color: switchTaskPriority(priority).color }}
          />
          {priority}
        </small>
        <small className="item">
          <i className="fas fa-gamepad" />
          {points}
        </small>
        <small
          title="Last Updated"
          className="item"
        >
          {getTimeAgo(dateModified?.toDate())}
        </small>
      </div>
      <div className="assignees">
        {
          assigneesIDs?.length > 0 ?
            <MultipleUsersAvatars
              userIDs={assigneesIDs}
              maxAvatars={10}
              avatarDimensions={27}
            /> :
            <small>No Assignees</small>
        }
      </div>
    </Link>
  )
}