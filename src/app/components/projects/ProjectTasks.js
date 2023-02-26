import { tasksIndex } from "app/algolia"
import { projectTasksSortByOptions } from "app/data/projectsData"
import { useInstantSearch } from "app/hooks/searchHooks"
import React, { useState } from 'react'
import { AppInput, AppSelect } from "../ui/AppInputs"
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
  const showAll = true
  const tasksFilters = `orgID:${project.orgID} AND projectID:${project.projectID}`

  const allTasks = useInstantSearch(
    query,
    tasksIndex,
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
            iconright={<i className="far fa-search" />}
          />
          <AppSelect
            label="Show"
            options={showXResultsOptions}
            onChange={(e) => setHitsPerPage(e.target.value)}
            value={hitsPerPage}
          />
        </div>
        <div className="sortings">
          <AppSelect
            label="Sort By"
            options={projectTasksSortByOptions}
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
