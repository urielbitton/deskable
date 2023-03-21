import { infoToast, successToast } from "app/data/toastsTemplates"
import { useOrgProject } from "app/hooks/projectsHooks"
import { useMultipleQueries } from "app/hooks/searchHooks"
import { useUsers } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import {
  cancelOrgProjectInvitationService,
  completeProjectSprintService,
  createProjectColumnService,
  inviteMembersToProjectService,
  updateOrgProjectService,
  updateProjectSprintDetails
} from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { areArraysEqual } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import {
  NavLink, Route, Routes,
  useLocation, useNavigate, useParams
} from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppInput, AppSelect, AppTextarea } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import AppTabsBar from "../ui/AppTabsBar"
import Avatar from "../ui/Avatar"
import DropdownButton from "../ui/DropdownButton"
import DropdownSearch from "../ui/DropdownSearch"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import AskProjectAccess from "./AskProjectAccess"
import OrgUsersTagInput from "./OrgUsersTagInput"
import ProjectBacklog from "./ProjectBacklog"
import ProjectBoard from "./ProjectBoard"
import ProjectPages from "./ProjectPages"
import ProjectSearchItem from "./ProjectSearchItem"
import ProjectSettings from "./ProjectSettings"
import ProjectTaskPage from "./ProjectTaskPage"
import ProjectTasks from "./ProjectTasks"
import './styles/SingleProject.css'

export default function SingleProject() {

  const { myOrgID, myUserID, setToasts, photoURLPlaceholder,
    setPageLoading, myUserName } = useContext(StoreContext)
  const projectID = useParams().projectID
  const project = useOrgProject(projectID)
  const [showOptions, setShowOptions] = useState(false)
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')
  const [columnLoading, setColumnLoading] = useState(false)
  const [filterUserIDs, setFilterUserIDs] = useState([])
  const [selectedFilterUsers, setSelectedFilterUsers] = useState([])
  const [searchString, setSearchString] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [totalHits, setTotalHits] = useState(0)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [invitesQuery, setInvitesQuery] = useState('')
  const [inviteesIDs, setInviteesIDs] = useState([])
  const [inviteLoading, setInviteLoading] = useState(false)
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [projectInvitees, setProjectInvitees] = useState([])
  const [sprintName, setSprintName] = useState('')
  const [sprintGoal, setSprintGoal] = useState('')
  const [showSprintDetailsModal, setShowSprintDetailsModal] = useState(false)
  const [sprintDetailsLoading, setSprintDetailsLoading] = useState(false)
  const [showCompleteSprintModal, setShowCompleteSprintModal] = useState(false)
  const [sprintCompleteLoading, setSprintCompleteLoading] = useState(false)
  const [moveTasksTo, setMoveTasksTo] = useState('new-sprint')
  const usersFilters = `activeOrgID:${myOrgID} AND NOT userID:${myUserID} AND NOT ` +
    `${project?.members?.map(member => `userID:${member}`).join(' AND NOT ')}`
  const searchHitsPerPage = 20
  const allMembers = project?.members
  const userIsMember = allMembers?.includes(myUserID)
  const navigate = useNavigate()
  const location = useLocation()
  const invitedUsers = useUsers(inviteesIDs)
  const projectInvitedUsers = useUsers(projectInvitees)
  const searchFilters = `orgID: ${myOrgID} AND projectID: ${projectID}`
  const showAll = false
  const isBoardPage = location.pathname.split('/')[3] === 'board'
  const isBacklogPage = location.pathname.split('/')[3] === 'backlog'
  const isTasksPage = location.pathname.split('/')[3] === 'tasks'
  const isPagesPage = location.pathname.split('/')[3] === 'pages'
  const isSettingsPage = location.pathname.split('/')[3] === 'settings'
  const projectPath = `organizations/${myOrgID}/projects`

  const tasksFilter = (tasks, column) => {
    return tasks?.filter(task => {
      return task?.columnID === column?.columnID
        && filterUserIDs.length > 0 ? (
        ((
          task.assigneesIDs.some(id => filterUserIDs.includes(id))
          || (areArraysEqual(allMembers, filterUserIDs) && filterUserIDs.includes('unassigned') && task.assigneesIDs.length === 0)
        )
          || (
            filterUserIDs.includes('unassigned') && task.assigneesIDs.length === 0
          )
        )
      ) : task?.columnID === column?.columnID
    })
  }

  const backlogTasksFilter = (tasks) => {
    return tasks?.filter(task => {
      return filterUserIDs.length > 0 ? (
        ((
          task.assigneesIDs.some(id => filterUserIDs.includes(id))
          || (areArraysEqual(allMembers, filterUserIDs) && filterUserIDs.includes('unassigned') && task.assigneesIDs.length === 0)
        )
          || (
            filterUserIDs.includes('unassigned') && task.assigneesIDs.length === 0
          )
        )
      ) : true
    })
  }

  const moveTaskToOptions = [
    { label: 'New Sprint', value: 'new-sprint' },
    { label: 'Backlog', value: 'backlog' },
  ]

  const multipleQueries = [
    {
      indexName: 'tasks_index',
      query: searchQuery,
      params: {
        hitsPerPage: searchHitsPerPage,
        filters: searchFilters
      }
    },
    {
      indexName: 'project_pages_index',
      query: searchQuery,
      params: {
        hitsPerPage: searchHitsPerPage,
        filters: searchFilters
      }
    }
  ]

  const limitsArr = []

  const searchResultsList = useMultipleQueries(
    searchQuery,
    multipleQueries,
    setTotalHits,
    limitsArr,
    setSearchLoading,
    showAll
  )

  const searchTasksList = searchResultsList?.map((result, index) => {
    return <div
      className="search-result-list"
      key={index}
    >
      {
        result?.hits?.length > 0 ?
          <h6>Tasks ({result?.hits?.length})</h6> :
          <h6><i className="fas fa-file-search" />No Results Found</h6>
      }
      {
        result?.hits?.map((item, index) => {
          return <ProjectSearchItem
            key={index}
            itemID={item.objectID}
            isTaskType={item.taskID !== undefined}
            setShowSearchDropdown={setShowSearchDropdown}
            projectID={item.projectID}
            title={item.title}
            taskType={item.taskType}
            taskNum={item.taskNum}
          />
        })
      }
    </div>
  })

  const invitedUsersList = invitedUsers?.map((user, index) => {
    return <InvitedUser
      key={index}
      user={user}
      action={
        <IconContainer
          icon="fal fa-times"
          onClick={() => setInviteesIDs(inviteesIDs.filter(id => id !== user?.userID))}
          iconColor="var(--grayText)"
          iconSize={14}
          dimensions={25}
        />
      }
    />
  })

  const projectInvitedUsersList = projectInvitedUsers?.map((user, index) => {
    return <InvitedUser
      key={index}
      user={user}
      action={
        <AppButton
          label="Cancel Invitation"
          buttonType="invertedBtn small"
          onClick={() => cancelInvitation(user)}
        />
      }
    />
  })

  const handleClearSearch = () => {
    setSearchString('')
    setSearchQuery('')
  }

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
      setColumnLoading,
      setToasts
    )
      .then(() => {
        resetColumnModal()
      })
  }

  const starProject = () => {
    updateOrgProjectService(
      myOrgID,
      projectID,
      {
        isStarred: !project.isStarred
      },
      setToasts,
      setPageLoading
    )
      .then(() => {
        setToasts(successToast(`Project ${project.isStarred ? 'unstarred' : 'starred'}`))
      })
  }

  const completeSprint = () => {
    const confirm = window.confirm('Are you sure you want to complete this sprint? This action cannot be undone.')
    if (!confirm) return
    completeProjectSprintService(
      projectPath, 
      project, 
      moveTasksTo,
      setToasts, 
      setPageLoading
    )
      .then(() => {
        setShowCompleteSprintModal(false)
        navigate(`/projects/${projectID}/backlog`)
      })
  }
  

  const archiveProject = () => {

  }

  const resetAllFilters = () => {
    resetUserFilters()
  }

  const onUserFilterClick = (user) => {
    const newSelectedFilterUsers = selectedFilterUsers.includes(user.userID)
      ? selectedFilterUsers.filter(id => id !== user.userID)
      : [...selectedFilterUsers, user.userID]
    setSelectedFilterUsers(newSelectedFilterUsers)
    setFilterUserIDs(newSelectedFilterUsers)
  }

  const unassignedFilterClick = () => {
    const newSelectedFilterUsers = selectedFilterUsers.includes('unassigned')
      ? selectedFilterUsers.filter(id => id !== 'unassigned')
      : [...selectedFilterUsers, 'unassigned']
    setSelectedFilterUsers(newSelectedFilterUsers)
    setFilterUserIDs(newSelectedFilterUsers)
  }

  const resetUserFilters = () => {
    setSelectedFilterUsers([])
    setFilterUserIDs([...allMembers, 'unassigned'])
  }

  const closeInviteModal = () => {
    setShowInviteModal(false)
    setInviteesIDs([])
    setInvitesQuery('')
  }

  const inviteMembers = () => {
    if (!inviteesIDs.length) return setToasts(infoToast('Please select at least one user to invite.'))
    inviteMembersToProjectService(
      myOrgID,
      project,
      inviteesIDs,
      myUserID,
      myUserName,
      setToasts,
      setInviteLoading
    )
      .then(() => {
        closeInviteModal()
      })
  }

  const cancelInvitation = (user) => {
    cancelOrgProjectInvitationService(
      myOrgID,
      project,
      user.userID,
      setToasts,
      setPageLoading
    )
      .then(() => {
        closeInviteModal()
      })
  }

  const initSprintModal = () => {
    setShowSprintDetailsModal(true)
    setSprintName(project.sprintName)
    setSprintGoal(project.sprintGoal)
  }

  const resetSprintModal = () => {
    setShowSprintDetailsModal(false)
    setSprintName('')
    setSprintGoal('')
  }

  const saveSprintDetails = () => {
    if (!sprintName || !sprintGoal) return setToasts(infoToast('Please enter a name for the sprint.'))
    updateProjectSprintDetails(
      projectPath, 
      projectID, 
      {
        sprintName,
        sprintGoal
      }, 
      setToasts, 
      setSprintDetailsLoading
    )
    .then(() => {
      resetSprintModal()
    })
  }

  useEffect(() => {
    if (project) {
      setFilterUserIDs([...allMembers, 'unassigned'])
      setProjectInvitees(project?.invitations || [])
    }
  }, [project])

  return project && userIsMember ? (
    <div
      className={`single-project ${(isTasksPage || isPagesPage || isSettingsPage) ? 'tasks-page' : ''} ${isBoardPage ? 'board-page' : ''}`}
      key={projectID}
    >
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
            <small className="cap">
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
                userIDs={allMembers}
                maxAvatars={5}
                avatarDimensions={27}
              />
            </small>
          </div>
          <DropdownSearch
            placeholder="Search this project..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            onEnterPress={() => {
              setSearchQuery(searchString)
              setShowSearchDropdown(true)
            }}
            searchResults={searchTasksList}
            showSearchDropdown={showSearchDropdown}
            setShowSearchDropdown={setShowSearchDropdown}
            searchLoading={searchLoading}
            clearSearch={() => handleClearSearch()}
          />
        </div>
      </div>
      <div className="project-toolbar">
        {
          (isBacklogPage || isBoardPage) &&
          <div className="top-side">
            <div className="left-side">
              <h5>
                <i 
                  className="fas fa-pen" 
                  onClick={() => initSprintModal()}
                />
                {project?.sprintName}
              </h5>
              <p>{project?.sprintGoal}</p>
            </div>
            <div className="btn-group">
              <div className="filter-by-user">
                <h6>Filter By Users</h6>
                <MultipleUsersAvatars
                  userIDs={allMembers}
                  maxAvatars={10}
                  avatarDimensions={30}
                  onUserClick={user => onUserFilterClick(user)}
                  avatarClassName={user => selectedFilterUsers.includes(user.userID) ? 'active' : ''}
                  extras={
                    <Avatar
                      src={photoURLPlaceholder}
                      dimensions={30}
                      title="Unassigned"
                      onClick={() => unassignedFilterClick()}
                      className={selectedFilterUsers.includes('unassigned') ? 'active' : ''}
                    />
                  }
                />
              </div>
              <AppButton
                label="Invite"
                buttonType="tabBtn"
                leftIcon="fas fa-user-plus"
                onClick={() => setShowInviteModal(true)}
              />
              {
                !isTasksPage &&
                <AppButton
                  label="Filters"
                  buttonType="tabBtn"
                  leftIcon="fas fa-filter"
                />
              }
              <DropdownButton
                label="Actions"
                buttonType="outlineGrayBtn"
                rightIcon="far fa-angle-down"
                showMenu={showOptions}
                setShowMenu={setShowOptions}
                className="dropdown-btn"
                items={[
                  ...isBoardPage ? [{ label: 'Add Column', icon: 'fas fa-columns', onClick: () => setShowColumnModal(true) }] : [],
                  { label: !project?.isStarred ? 'Star Project' : 'Unstar Project', icon: 'fas fa-star', onClick: () => starProject() },
                  ...project?.isSprintActive ? [{ label: 'Complete Sprint', icon: 'fas fa-check-square', onClick: () => setShowCompleteSprintModal(true) }] : [],
                  { label: 'Archive Project', icon: 'fas fa-archive', onClick: () => archiveProject() },
                  { label: 'Reset Filters', icon: 'fas fa-sync', onClick: () => resetAllFilters() },
                  { label: 'Project Settings', icon: 'fas fa-cog', onClick: () => navigate('settings') },
                ]}
              />
            </div>
          </div>
        }
        <div className="bottom-side">
          <AppTabsBar
            noSpread
            spacedOut={10}
          >
            <NavLink to={`/projects/${projectID}/backlog`}><i className="fas fa-list" />Backlog</NavLink>
            <NavLink to={`/projects/${projectID}/board`}><i className="fas fa-columns" />Board</NavLink>
            <NavLink to={`/projects/${projectID}/tasks`}><i className="fas fa-tasks" />Tasks</NavLink>
            <NavLink to={`/projects/${projectID}/pages`}><i className="fas fa-file-alt" />Pages</NavLink>
            <NavLink to={`/projects/${projectID}/settings`}><i className="fas fa-cog" />Settings</NavLink>
          </AppTabsBar>
        </div>
      </div>
      <div className="tasks-routes-container">
        <Routes>
          <Route
            path="board"
            element={
              <ProjectBoard 
                project={project} 
                tasksFilter={tasksFilter} 
              />
            }
          />
          <Route
            path="backlog"
            element={
              <ProjectBacklog 
                project={project} 
                backlogTasksFilter={backlogTasksFilter} 
                setShowCompleteSprintModal={setShowCompleteSprintModal}
                setShowSprintDetailsModal={setShowSprintDetailsModal}
              />
            }
          />
          <Route path="tasks" element={<ProjectTasks project={project} />} />
          <Route path="tasks/:taskID" element={<ProjectTaskPage />} />
          <Route path="pages" element={<ProjectPages project={project} />} />
          <Route path="settings" element={<ProjectSettings project={project} />} />
        </Routes>
      </div>
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
              rightIcon={columnLoading ? "fas fa-spinner fa-spin" : null}
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
      <AppModal
        showModal={showInviteModal}
        setShowModal={setShowInviteModal}
        label="Invite Members"
        portalClassName="invite-members-modal"
        onClose={() => closeInviteModal()}
        actions={<>
          <AppButton
            label={`Invite ${inviteesIDs.length > 0 ? inviteesIDs.length : ''} Member${inviteesIDs.length !== 1 ? 's' : ''}`}
            onClick={() => inviteMembers()}
            loading={inviteLoading}
            disabled={inviteesIDs.length < 1}
          />
          <AppButton
            label="Cancel"
            buttonType="outlineBtn"
            onClick={() => closeInviteModal()}
          />
        </>}
      >
        <div className="invite-members-container">
          <OrgUsersTagInput
            label="Search for members to invite to the project"
            name="invites"
            placeholder="Invite members..."
            query={invitesQuery}
            value={invitesQuery}
            onChange={(e) => setInvitesQuery(e.target.value)}
            setLoading={setSearchLoading}
            filters={usersFilters}
            onUserClick={(e, user) => {
              setInviteesIDs([...inviteesIDs, user.userID])
              setInvitesQuery('')
            }}
            onUserRemove={(user) => setInviteesIDs(prev => prev.filter(id => id !== user.userID))}
            onFocus={() => setShowCoverInput('invites')}
            showDropdown={showCoverInput}
            setShowDropdown={setShowCoverInput}
            iconleft={<div className="icon"><i className="far fa-user" /></div>}
            selectedUsers={[...invitedUsers, ...projectInvitedUsers]}
            multiple={inviteesIDs?.length > 1}
            maxAvatars={10}
            onClear={() => setInviteesIDs([])}
            showAll={false}
            typeSearch
            showUserEmails
          />
          {
            invitedUsers?.length > 0 &&
            <div className="invited-users-flex">
              <h5>Invited Users</h5>
              <div className="invited-users-list">
                {invitedUsersList}
              </div>
            </div>
          }
          {
            projectInvitedUsers?.length > 0 &&
            <div className="invited-users-flex">
              <h5>Previously Invited Users</h5>
              <div className="invited-users-list">
                {projectInvitedUsersList}
              </div>
            </div>
          }
        </div>
      </AppModal>
      <AppModal
        showModal={showSprintDetailsModal}
        setShowModal={setShowSprintDetailsModal}
        label="Sprint Details"
        portalClassName="sprint-details-modal"
        actions={
          <>
            <AppButton
              label="Save Changes"
              onClick={() => saveSprintDetails()}
              loading={sprintDetailsLoading}
            />
            <AppButton
              label="Cancel"
              buttonType="outlineBtn"
              onClick={() => resetSprintModal()}
            />
          </>
        }
      >
        <AppInput
          label="Sprint Name"
          placeholder="Enter a sprint name"
          value={sprintName}
          onChange={(e) => setSprintName(e.target.value)}
          maxLength={30}
        />
        <AppTextarea
          label="Sprint Goal"
          placeholder="Describe the sprint's goal"
          value={sprintGoal}
          onChange={(e) => setSprintGoal(e.target.value)}
          maxLength={100}
        />
        <h6>Sprint Number: {project?.sprintNumber}</h6>
      </AppModal>
      <AppModal
        showModal={showCompleteSprintModal}
        setShowModal={setShowCompleteSprintModal}
        label="Complete Sprint?"
        portalClassName="sprint-details-modal"
        actions={
          <>
            <AppButton
              label="Complete Sprint"
              onClick={() => completeSprint()}
              loading={sprintCompleteLoading}
            />
            <AppButton
              label="Cancel"
              buttonType="outlineBtn"
              onClick={() => setShowCompleteSprintModal(false)}
            />
          </>
        }
      >
        <AppSelect
          label="Move Incomplete Tasks to:"
          options={moveTaskToOptions}
          value={moveTasksTo}
          onChange={(e) => setMoveTasksTo(e.target.value)}
          maxLength={30}
        />
      </AppModal>
    </div>
  ) :
    project && !userIsMember ? (
      <AskProjectAccess project={project} />
    ) :
      <div className="project-page-not-found">
        <i className="fas fa-island-tropical" />
        <h5>The project page you are looking for does not exist</h5>
        <AppButton
          label="Go to Projects"
          url="/projects"
        />
      </div>
}

export function InvitedUser({ user, action }) {

  return <div className="invited-user">
    <div className="texts">
      <Avatar
        src={user?.photoURL}
        dimensions={25}
      />
      <h6>{user?.firstName} {user?.lastName}</h6>
    </div>
    {action}
  </div>
}