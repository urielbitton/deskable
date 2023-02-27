import { projectTasksSortByOptions, projectTasksSortBySwitch } from "app/data/projectsData"
import { useInstantSearch } from "app/hooks/searchHooks"
import React, { useState } from 'react'
import { AppInput, AppReactSelect, AppSelect } from "../ui/AppInputs"
import ProjectTaskCard from "./ProjectTaskCard"
import './styles/ProjectTasks.css'
import AppPagination from "../ui/AppPagination"
import { showXResultsOptions } from "app/data/general"

export default function ProjectTasks({ project }) {

  const [searchString, setSearchString] = useState('')
  const [query, setQuery] = useState('')
  const [numOfHits, setNumOfHits] = useState(0)
  const [numOfPages, setNumOfPages] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [searchLoading, setSearchLoading] = useState(false)
  const [sortByIndex, setSortByIndex] = useState(projectTasksSortByOptions[0].value)
  const showAll = true
  const tasksFilters = `orgID:${project.orgID} AND projectID:${project.projectID}`

  const allTasks = useInstantSearch(
    query,
    projectTasksSortBySwitch(sortByIndex).index,
    tasksFilters,
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

  const clearSearch = () => {
    setSearchString('')
    setQuery('')
  }

  return (
    <div className="project-tasks">
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
            searchable={false}
          />
          <h6>Filters</h6>
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
  )
}
