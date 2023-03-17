import { projectTasksSortByOptions, projectTasksSortBySwitch } from "app/data/projectsData"
import { useInstantSearch } from "app/hooks/searchHooks"
import React, { useState } from 'react'
import { AppInput, AppReactSelect, AppSelect } from "../ui/AppInputs"
import ProjectTaskCard from "./ProjectTaskCard"
import './styles/ProjectTasks.css'
import AppPagination from "../ui/AppPagination"
import { showXResultsOptions } from "app/data/general"
import AppButton from "../ui/AppButton"
import TaskFiltersPopup from "./TaskFiltersPopup"
import { useOrgProjectColumns } from "app/hooks/projectsHooks"
import { useParams } from "react-router-dom"
import noTasksImg from 'app/assets/images/project-task-illustration.png'
import EmptyPage from "../ui/EmptyPage"

export default function ProjectTasks({ project }) {

  const projectID = useParams().projectID
  const projectColumns = useOrgProjectColumns(projectID)
  const [searchString, setSearchString] = useState('')
  const [query, setQuery] = useState('')
  const [numOfHits, setNumOfHits] = useState(0)
  const [numOfPages, setNumOfPages] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [searchLoading, setSearchLoading] = useState(false)
  const [sortByIndex, setSortByIndex] = useState(projectTasksSortByOptions[0].value)
  const [showFilters, setShowFilters] = useState(false)
  const [taskTypeFilter, setTaskTypeFilter] = useState('all')
  const [pointsFilter, setPointsFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [applyFilters, setApplyFilters] = useState({
    taskType: 'all',
    points: 'all',
    priority: 'all',
    status: 'all',
  })
  const showAll = true

  const activeFilters = applyFilters.taskType !== 'all' ||
    applyFilters.points !== 'all' ||
    applyFilters.priority !== 'all' ||
    applyFilters.status !== 'all'

  const disableApplyFilters = taskTypeFilter === applyFilters.taskType &&
    pointsFilter === applyFilters.points &&
    priorityFilter === applyFilters.priority &&
    statusFilter === applyFilters.status

  const searchFilters = `orgID:${project.orgID} AND projectID:${project.projectID} ` +
    `${applyFilters.taskType !== 'all' ? ` AND taskType:${applyFilters.taskType} ` : ''}` +
    `${applyFilters.points !== 'all' ? ` AND points:${applyFilters.points} ` : ''}` +
    `${applyFilters.priority !== 'all' ? ` AND priority:${applyFilters.priority} ` : ''}` +
    `${applyFilters.status !== 'all' ? ` AND status: "${applyFilters.status}" ` : ''}`


  const allTasks = useInstantSearch(
    query,
    projectTasksSortBySwitch(sortByIndex).index,
    searchFilters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setSearchLoading,
    showAll
  )

  const allTasksList = allTasks?.map((task, index) => {
    return <ProjectTaskCard
      key={index}
      task={task}
    />
  })

  const handleSaveFilters = () => {
    setApplyFilters({
      taskType: taskTypeFilter,
      points: pointsFilter,
      priority: priorityFilter,
      status: statusFilter,
    })
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    setTaskTypeFilter('all')
    setPointsFilter('all')
    setPriorityFilter('all')
    setStatusFilter('all')
    setApplyFilters({
      taskType: 'all',
      points: 'all',
      priority: 'all',
      status: 'all',
    })
    setShowFilters(false)
  }

  const clearSearch = () => {
    setSearchString('')
    setQuery('')
  }

  return allTasks ? (
    <div
      className="project-tasks"
      key={projectID}
    >
      <div className="toolbar">
        <div className="search-info">
          <h5>{Math.min(numOfHits, hitsPerPage)} of <span>{numOfHits}</span> tasks</h5>
          <AppInput
            placeholder="Search tasks..."
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && setQuery(searchString)}
            iconright={
              searchLoading ?
                <i className="fas fa-spinner fa-spin" /> :
                searchString.length > 0 ?
                  <i
                    className="fal fa-times"
                    onClick={() => clearSearch()}
                  /> :
                  <i className="far fa-search" />
            }
          />
          <AppSelect
            label="Show"
            options={showXResultsOptions}
            onChange={(e) => setHitsPerPage(e.target.value)}
            value={hitsPerPage}
          />
        </div>
        <div className="sortings">
          <div className="task-filters">
            <AppButton
              label={activeFilters ? "Active Filters" : "Filters"}
              buttonType="invertedBtn"
              leftIcon="fas fa-filter"
              onClick={() => setShowFilters(prev => !prev)}
              className={`filter-btn ${showFilters ? 'active' : ''} ${activeFilters ? 'active-filters' : ''}`}
            />
            <TaskFiltersPopup
              showPopup={showFilters}
              setShowPopup={setShowFilters}
              onClose={() => setShowFilters(false)}
              taskTypeFilter={taskTypeFilter}
              setTaskTypeFilter={setTaskTypeFilter}
              pointsFilter={pointsFilter}
              setPointsFilter={setPointsFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              taskStatusOptions={projectColumns?.map(column => ({ value: column.title, label: column.title }))}
              disableApply={disableApplyFilters}
              saveFilters={handleSaveFilters}
              clearFilters={() => handleClearFilters()}
            />
          </div>
          <AppReactSelect
            label="Sort By"
            placeholder={
              <h5 className="placeholder">
                <i className={projectTasksSortBySwitch(sortByIndex).icon} />
                {projectTasksSortBySwitch(sortByIndex).name}
              </h5>
            }
            options={projectTasksSortByOptions}
            onChange={(sortBy) => setSortByIndex(sortBy.value)}
            value={sortByIndex}
          />
        </div>
      </div>
      <div className="tasks-content">
        {allTasksList}
      </div>
      <div className="tasks-pagination">
        <AppPagination
          pageNum={pageNum}
          setPageNum={setPageNum}
          numOfPages={numOfPages}
          dimensions="30px"
        />
      </div>
    </div>
  ) :
    <EmptyPage
      label="You have no tasks yet"
      sublabel="Create a new task to get started"
      btnLink={`/projects/${projectID}/backlog`}
      btnIcon="fal fa-plus"
      btnLabel="New Task"
      img={noTasksImg}
    />
}
