import { useOrgProject } from "app/hooks/projectsHooks"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useState } from 'react'
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AppTabsBar from "../ui/AppTabsBar"
import Avatar from "../ui/Avatar"
import DropdownButton from "../ui/DropdownButton"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import ProjectBacklog from "./ProjectBacklog"
import ProjectBoard from "./ProjectBoard"
import './styles/SingleProject.css'

export default function SingleProject() {

  const projectID = useParams().projectID
  const project = useOrgProject(projectID)
  const [searchString, setSearchString] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  return project ? (
    <div className="single-project">
      <div className="project-header">
        <div className="titles">
          <Avatar
            src={project.photoURL}
            dimensions={30}
            alt={project.name}
          />
          <h3>{project.name}</h3>
        </div>
        <div className="details">
          <div className="info">
            <small>
              Category:
              <span>{project.category}</span>
            </small>
            <small>
              Date Created:
              <span>{convertClassicDate(project.dateCreated?.toDate())}</span>
            </small>
            <small>
              Team:
              <MultipleUsersAvatars
                userIDs={project.members}
                avatarsToDisplay={4}
                avatarDimensions={24}
              />
            </small>
          </div>
          <AppInput
            placeholder="Search"
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
            iconright={<i className="fal fa-search" />}
          />
        </div>
      </div>
      <div className="project-toolbar">
        <div className="top-side">
          <div className="left-side">
            <h5>Overview</h5>
            <p>Drag and drop cards to edit them</p>
          </div>
          <div className="btn-group">
            <AppButton
              label="Invite"
              buttonType="tabBtn"
              leftIcon="fas fa-user-plus"
            />
            <AppButton
              label="Filter"
              buttonType="tabBtn"
              leftIcon="fas fa-filter"
            />
            <DropdownButton
              label="Actions"
              buttonType="outlineGrayBtn"
              rightIcon="far fa-angle-down"
              showMenu={showOptions}
              setShowMenu={setShowOptions}
              className="dropdown-btn"
              items={[
                { label: 'Add to favorites', icon: 'fas fa-star', onClick: () => console.log('Add to favorites') },
                { label: 'Edit', icon: 'fas fa-pen', onClick: () => console.log('Edit') },
                { label: 'Delete', icon: 'fas fa-trash', onClick: () => console.log('Delete') },
                { label: 'Archive', icon: 'fas fa-archive', onClick: () => console.log('Archive') },
              ]}
            />
          </div>
        </div>
        <div className="bottom-side">
          <AppTabsBar noSpread spacedOut>
            <NavLink to={`/projects/${projectID}/backlog`}>Backlog</NavLink>
            <NavLink to={`/projects/${projectID}/current-sprint`}>Sprint</NavLink>
          </AppTabsBar>
        </div>
      </div>
      <Routes>
        <Route path="backlog" element={<ProjectBacklog />} />
        <Route path="current-sprint" element={<ProjectBoard />} />
      </Routes>
    </div>
  ) :
    null
}
