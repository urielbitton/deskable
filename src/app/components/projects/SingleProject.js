import { infoToast } from "app/data/toastsTemplates"
import { useOrgProject } from "app/hooks/projectsHooks"
import { createProjectColumnService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useState } from 'react'
import { NavLink, Route, Routes, useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import AppTabsBar from "../ui/AppTabsBar"
import Avatar from "../ui/Avatar"
import DropdownButton from "../ui/DropdownButton"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import ProjectBacklog from "./ProjectBacklog"
import ProjectBoard from "./ProjectBoard"
import ProjectTasks from "./ProjectTasks"
import './styles/SingleProject.css'

export default function SingleProject() {

  const { myOrgID, myUserID, setToasts } = useContext(StoreContext)
  const projectID = useParams().projectID
  const project = useOrgProject(projectID)
  const [searchString, setSearchString] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const userIsMember = project?.members?.includes(myUserID)

  const resetColumnModal = () => {
    setShowColumnModal(false)
    setColumnTitle('')
  }

  const addColumn = () => {
    if (!columnTitle) return setToasts(infoToast('Please enter a title for the column.'))
    createProjectColumnService(
      myOrgID,
      projectID,
      columnTitle,
      setLoading,
      setToasts
    )
    .then(() => {
      resetColumnModal()
    })
  }

  const addTask = () => {

  }

  const starProject = () => {

  }

  const initEditProject = () => {

  }

  const deleteProject = () => {

  }

  const archiveProject = () => {

  }

  return project && userIsMember ? (
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
                maxAvatars={4}
                avatarDimensions={24}
              />
            </small>
          </div>
          <AppInput
            placeholder="Search this project..."
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
                { label: 'Add Column', icon: 'fas fa-columns', onClick: () => setShowColumnModal(true) },
                { label: 'Add Task', icon: 'fas fa-tasks', onClick: () => addTask() },
                { label: 'Star Project', icon: 'fas fa-star', onClick: () => starProject() },
                { label: 'Edit Project', icon: 'fas fa-pen', onClick: () => initEditProject() },
                { label: 'Delete Project', icon: 'fas fa-trash', onClick: () => deleteProject() },
                { label: 'Archive Project', icon: 'fas fa-archive', onClick: () => archiveProject() },
              ]}
            />
          </div>
        </div>
        <div className="bottom-side">
          <AppTabsBar
            noSpread
            spacedOut={10}
          >
            <NavLink to={`/projects/${projectID}/board`}>Board</NavLink>
            <NavLink to={`/projects/${projectID}/backlog`}>Backlog</NavLink>
            <NavLink to={`/projects/${projectID}/tasks`}>Tasks</NavLink>
          </AppTabsBar>
        </div>
      </div>
      <Routes>
        <Route path="board" element={<ProjectBoard project={project} />} />
        <Route path="backlog" element={<ProjectBacklog />} />
        <Route path="tasks" element={<ProjectTasks />} />
      </Routes>
      <AppModal
        showModal={showColumnModal}
        setShowModal={setShowColumnModal}
        label="Add Column"
        portalClassName="add-column-modal"
        actions={
          <>
            <AppButton
              label="Add Column"
              buttonType="primaryBtn"
              onClick={() => addColumn()}
              rightIcon={loading ? "fas fa-spinner fa-spin" : null}
            />
            <AppButton
              label="Cancel"
              buttonType="outlineBtn"
              onClick={() => resetColumnModal()}
            />
          </>
        }
      >
        <AppInput
          label="Column Title"
          placeholder="Enter a column title"
          value={columnTitle}
          onChange={e => setColumnTitle(e.target.value)}
        />
      </AppModal>
    </div>
  ) : 
  project && !userIsMember ? (
    <div>
      <h4>You are not a member of this project.</h4>
      <p>You can ask your organization admin for access here.</p>
    </div>
  ) :
  <div style={{width: '100%', height: '100%', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <i className="fal fa-spinner fa-spin" style={{fontSize: 20}}  />
  </div>
}
