import { projectsIndex } from "app/algolia"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { useInstantSearch } from "app/hooks/searchHooks"
import useUser from "app/hooks/userHooks"
import { updateOrgProjectService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertAlgoliaDate, convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AppPagination from "../ui/AppPagination"
import AppTable from "../ui/AppTable"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import './styles/AllProjects.css'

export default function AllProjects() {

  const { myOrgID, myUserID, setToasts } = useContext(StoreContext)
  const [searchString, setSearchString] = useState('')
  const [query, setQuery] = useState('')
  const [pageNum, setPageNum] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [numOfHits, setNumOfHits] = useState(0)
  const [numOfPages, setNumOfPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const filters = `orgID: ${myOrgID}`
  const showAll = true

  const allProjects = useInstantSearch(
    query,
    projectsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setLoading,
    showAll
  )

  const allProjectsList = allProjects?.map((project, index) => {
    return <ProjectRow
      key={index}
      project={project}
      onStarClick={() => starProject(project)}
    />
  })

  const starProject = (project) => {
    if (project?.ownerID !== myUserID) return setToasts(errorToast('You must be the owner of this project to star it.'))
    updateOrgProjectService(
      myOrgID,
      project.projectID,
      {
        isStarred: !project.isStarred
      },
      setToasts,
      () => { }
    )
      .then(() => {
        setToasts(successToast(`Project ${project.isStarred ? 'unstarred' : 'starred'}`))
      })
  }

  const clearInput = () => {
    setSearchString('')
    setQuery('')
  }

  return (
    <div className="all-projects-page">
      <h3>Organization Projects</h3>
      <div className="toolbar">
        <div className="left">
          <AppInput
            placeholder="Search projects..."
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && setQuery(searchString)}
            iconright={
              loading ?
                <i className="fal fa-spinner-third fa-spin" /> :
                (searchString.length > 0 || query.length > 0) ?
                  <i
                    className="fal fa-times"
                    onClick={() => clearInput()}
                  /> :
                  <i className="fal fa-search" />
            }
          />
          <h6 className="hits-text">{numOfHits} Project{numOfHits !== 1 && 's'}</h6>
        </div>
        <div className="right">
          <AppButton
            label="New Project"
            url="/projects/new"
            leftIcon="fal fa-plus"
          />
        </div>
      </div>
      <div className="content">
        <AppTable
          headers={[
            <i className="fal fa-star" />,
            "Name",
            "Key",
            "Category",
            "Creator",
            "Date Created",
            "Actions",
          ]}
          rows={allProjectsList}
          flexBasis="20%"
        />
      </div>
      <div className="footer">
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

export function ProjectRow(props) {

  const { name, ownerID, category, dateCreated, projectKey,
    projectID, isStarred } = props.project
  const { onStarClick } = props
  const owner = useUser(ownerID)
  const navigate = useNavigate()

  return (
    <div className="project-row">
      <div className="row-item star small">
        <i
          className={`fa${isStarred ? 's' : 'l'} fa-star`}
          onClick={onStarClick}
        />
      </div>
      <Link
        className="row-item title"
        to={`/projects/${projectID}/backlog`}
      >
        <h6>{name}</h6>
      </Link>
      <div className="row-item">
        <h6>{projectKey}</h6>
      </div>
      <div className="row-item">
        <h6 className="cap">{category}</h6>
      </div>
      <div className="row-item">
        <Avatar
          src={owner?.photoURL}
          dimensions={25}
        />
        <h6>{owner?.firstName} {owner?.lastName}</h6>
      </div>
      <div className="row-item">
        <h6>{convertClassicDate(convertAlgoliaDate(dateCreated))}</h6>
      </div>
      <div className="row-item small">
        <IconContainer
          icon="fas fa-cog"
          dimensions={22}
          iconColor="var(--grayText)"
          iconSize={15}
          onClick={() => navigate(`/projects/${projectID}/settings`)}
        />
      </div>
    </div>
  )
}