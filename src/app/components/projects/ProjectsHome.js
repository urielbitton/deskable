import {
  recentTasksSortByOptions, recentTasksSortBySwitch,
  switchTaskPriority, switchTaskType
} from "app/data/projectsData"
import {
  useLastMonthOrgOpenProjectTasks,
  useOrgProjects
} from "app/hooks/projectsHooks"
import { StoreContext } from "app/store/store"
import { getTimeAgo } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppReactSelect } from "../ui/AppInputs"
import AppScrollSlider from "../ui/AppScrollSlider"
import AppTabsBar from "../ui/AppTabsBar"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import ProjectCard from "./ProjectCard"
import './styles/ProjectsHome.css'

export default function ProjectsHome({ setShowScroll }) {

  const { myUserID } = useContext(StoreContext)
  const [tabsBarIndex, setTabsBarIndex] = useState('tasks')
  const [sortBy, setSortBy] = useState(recentTasksSortByOptions[0].value)
  const [assignToMe, setAssignToMe] = useState(false)
  const [showOpenTasks, setShowOpenTasks] = useState(true)
  const projectsLimit = 5
  const tasksLimit = 50
  const recentProjects = useOrgProjects(projectsLimit)
  const recentOrgTasks = useLastMonthOrgOpenProjectTasks(!showOpenTasks, tasksLimit)
  const projectsSliderRef = useRef(null)
  const oneWeekMs = 604800000
  const oneMonthMs = 2592000000

  const recentTasksSort = (a, b) => {
    if (sortBy === 'priority') {
      return (switchTaskPriority(b.priority).level - switchTaskPriority(a.priority).level)
    }
    else if (sortBy === 'points') {
      return b.points - a.points
    }
    return b.dateModified?.toDate() - a.dateModified?.toDate()
  }

  const lastWeekOrgTasksFiltered = recentOrgTasks
  ?.filter(task => recentOrgTasks?.some(t => t.projectID === task.projectID && t.assigneesIDs.includes(myUserID)))
  .filter(task => task.dateModified?.toDate() > Date.now() - oneWeekMs)
  .filter(task => !assignToMe || task.assigneesIDs?.includes(myUserID))
  .filter(task => !showOpenTasks || !task.isDone)
  .sort((a, b) => recentTasksSort(a, b))
  
  const lastMonthOrgTasksFiltered = recentOrgTasks
  ?.filter(task => recentOrgTasks?.some(t => t.projectID === task.projectID && t.assigneesIDs.includes(myUserID)))
  .filter(task => task.dateModified?.toDate() > Date.now() - oneMonthMs && task.dateModified?.toDate() < Date.now() - oneWeekMs)
  .filter(task => !assignToMe || task.assigneesIDs?.includes(myUserID))
  .filter(task => !showOpenTasks || !task.isDone)
  .sort((a, b) => recentTasksSort(a, b))

  const recentProjectsList = recentProjects?.map((project, index) => {
    return <ProjectCard
      key={index}
      project={project}
    />
  })

  const recentLastWeekOrgTasksList = lastWeekOrgTasksFiltered.map((task, index) => {
      return <TaskRow
        key={index}
        task={task}
      />
    })

  const recentLastMonthOrgTasksList = lastMonthOrgTasksFiltered.map((task, index) => {
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
      <h3>Dashboard</h3>
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
              <h6>In the last week ({lastWeekOrgTasksFiltered.length})</h6>
              <div className="filters">
              <AppButton
                  label={showOpenTasks ? 'Closed Tasks' : 'Open Tasks'}
                  buttonType={!showOpenTasks ? 'primaryBtn' : 'outlineBtn'}
                  onClick={() => setShowOpenTasks(prev => !prev)}
                />
                <AppButton
                  label={!assignToMe ? 'Assigned to me' : 'All Assignees'}
                  buttonType={assignToMe ? 'primaryBtn' : 'outlineBtn'}
                  onClick={() => setAssignToMe(prev => !prev)}
                />
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
            </div>
            <div className="sub-section">
              {recentLastWeekOrgTasksList}
            </div>
            <div className="title-row bottom">
              <h6>In the last month ({lastMonthOrgTasksFiltered.length})</h6>
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
              maxAvatars={5}
              avatarDimensions={27}
            /> :
            <small>No Assignees</small>
        }
      </div>
    </Link>
  )
}