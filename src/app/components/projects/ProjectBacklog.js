import {
  useOrgProjectBacklogTasks,
  useOrgProjectFirstColumn,
  useOrgProjectSprintTasks,
  useOrgProjectTask
} from "app/hooks/projectsHooks"
import React, { useContext, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppCoverInput, AppReactSelect } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import BacklogTaskItem from "./BacklogTaskItem"
import './styles/ProjectBacklog.css'
import DraggableItem from "../ui/DraggableItem"
import { DragDropContext } from "react-beautiful-dnd"
import DndDropper from "../ui/DndDropper"
import {
  sameColumnMoveBacklogTaskService,
  diffColumnMoveBacklogTaskService,
  getLastBacklogTaskPosition,
  getLastColumnTaskPosition,
  createOrgProjectTaskEvent,
  addNewSprintTaskService,
  addNewBacklogTaskService,
  startProjectSprintService,
  completeProjectSprintService
} from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { switchTaskType, taskTypeOptions } from "app/data/projectsData"
import BacklogTaskDetails from "./BacklogTaskDetails"
import { updateDB } from "app/services/CrudDB"
import { infoToast, successToast } from "app/data/toastsTemplates"
import { noWhiteSpaceChars } from 'app/utils/generalUtils'

export default function ProjectBacklog({ project, backlogTasksFilter }) {

  const { myOrgID, setToasts, myUserID, setPageLoading } = useContext(StoreContext)
  const projectID = useParams().projectID
  const [searchParams, setSearchParams] = useSearchParams()
  const paramTaskID = searchParams.get('taskID')
  const paramProjectID = searchParams.get('projectID')
  const taskDetailsOpen = paramTaskID !== null && paramProjectID !== null
  const [showTitlesMenu, setShowTitlesMenu] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [newTaskLoading, setNewTaskLoading] = useState(false)
  const [newTaskType, setNewTaskType] = useState(taskTypeOptions[0].value)
  const activeTask = useOrgProjectTask(projectID, paramTaskID)
  const sprintTasks = useOrgProjectSprintTasks(projectID, project?.activeSprintID)
  const backlogTasks = useOrgProjectBacklogTasks(projectID)
  const firstColumn = useOrgProjectFirstColumn(projectID)
  const sprintTasksNum = sprintTasks?.length
  const backlogTasksNum = backlogTasks?.length
  const noSprintTasks = sprintTasks?.length === 0
  const noBacklogTasks = backlogTasks?.length === 0
  const isSprintActive = project?.isSprintActive
  const projectPath = `organizations/${myOrgID}/projects`
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const navigate = useNavigate()

  const sprintTasksList = backlogTasksFilter(sprintTasks)
    ?.map((task, index) => {
      return <DraggableItem
        key={task.taskID} //key cannot be index, must be unique id
        draggableId={task.taskID}
        index={task.backlogPosition}
      >
        <BacklogTaskItem
          key={index}
          task={task}
          onClick={(e) => handleTaskClick(e, task.taskID)}
          isActive={task.taskID === paramTaskID}
        />
      </DraggableItem>
    })

  const backlogTasksList = backlogTasksFilter(backlogTasks)
    ?.map((task, index) => {
      return <DraggableItem
        key={task.taskID}
        draggableId={task.taskID}
        index={task.backlogPosition}
      >
        <BacklogTaskItem
          key={index}
          task={task}
          onClick={(e) => handleTaskClick(e, task.taskID)}
          isActive={task.taskID === paramTaskID}
        />
      </DraggableItem>
    })

  const diffColumnMoveTaskEvent = (taskID, source, destination) => {
    return createOrgProjectTaskEvent(
      `${tasksPath}/${taskID}/events`,
      myUserID,
      `moved the task from the <b>${source}</b> to the <b>${destination}</b>`,
      'far fa-expand-arrows',
      setToasts
    )
  }

  const onDragStart = () => {
    setIsDragging(true)
  }

  const toSprintMove = (source, destination, taskID) => {
    return getLastColumnTaskPosition(myOrgID, projectID, firstColumn?.columnID)
      .then((lastPosition) => {
        const positions = { backlogPosition: null, sprintPosition: isSprintActive ? lastPosition : null, sprintID: project.activeSprintID }
        diffColumnMoveBacklogTaskService(tasksPath, taskID, positions, source, destination, firstColumn, setToasts)
          .then(() => diffColumnMoveTaskEvent(taskID, source.droppableId, destination.droppableId))
      })
  }

  const handleMoveTask = (result) => {
    if (!result.destination || result.source.index === result.destination.index) {
      setIsDragging(false)
      return console.log('non droppable zone')
    }
    setIsDragging(false)
    const taskID = result.draggableId
    const source = result.source
    const destination = result.destination
    const sameColumnMove = source.droppableId === destination.droppableId
    const toBacklog = destination.droppableId === 'backlog'
    const toSprint = destination.droppableId === 'sprint'
    if (sameColumnMove) {
      sameColumnMoveBacklogTaskService(tasksPath, taskID, source, destination, setToasts)
    }
    else if (toBacklog) {
      getLastBacklogTaskPosition(myOrgID, projectID)
        .then((lastPosition) => {
          const positions = { backlogPosition: lastPosition, sprintPosition: null }
          diffColumnMoveBacklogTaskService(tasksPath, taskID, positions, source, destination, firstColumn, setToasts)
            .then(() => diffColumnMoveTaskEvent(taskID, source.droppableId, destination.droppableId))
        })
    }
    else if (toSprint) {
      if (noSprintTasks) {
        return updateDB(projectPath, projectID, { activeSprintID: 'pre-sprint' })
          .then(() => {
            return toSprintMove(source, destination, taskID)
          })
      }
      return toSprintMove(source, destination, taskID)
    }
  }

  const handleCancelNewTask = () => {
    setShowCoverInput(null)
    setNewTaskTitle('')
  }

  const addNewBacklogTask = () => {
    if (!noWhiteSpaceChars(newTaskTitle)) return setToasts(infoToast('Please enter a task title'))
    addNewBacklogTaskService(
      tasksPath,
      myUserID,
      project.name,
      {
        newTaskTitle,
        newTaskType,
      },
      setToasts,
      setNewTaskLoading
    )
      .then((taskID) => {
        setNewTaskTitle('')
        createOrgProjectTaskEvent(
          `${tasksPath}/${taskID}/events`,
          myUserID,
          `added task <b>${newTaskTitle}</b> to the project sprint plan`,
          'far fa-tasks',
          setToasts
        )
      })
  }

  const addNewSprintTask = () => {
    if (!noWhiteSpaceChars(newTaskTitle)) return setToasts(infoToast('Please enter a task title'))
    addNewSprintTaskService(
      tasksPath,
      myUserID,
      project.activeSprintID,
      firstColumn,
      project.name,
      {
        newTaskTitle,
        newTaskType,
      },
      setToasts,
      setNewTaskLoading
    )
      .then((taskID) => {
        setNewTaskTitle('')
        createOrgProjectTaskEvent(
          `${tasksPath}/${taskID}/events`,
          myUserID,
          `added task <b>${newTaskTitle}</b> to the sprint backlog`,
          'far fa-tasks',
          setToasts
        )
      })
  }

  const editSprint = () => {

  }

  const markCompleted = () => {
    const confirm = window.confirm('Are you sure you want to mark this sprint as completed? Incomplete tasks will be moved to the backlog.')
    if (!confirm) return
    completeProjectSprintService(

    )
    .then(() => {
      setToasts(successToast('Sprint marked as completed'))
    })
  }

  const handleStartSprint = () => {
    if (noSprintTasks) return setToasts(infoToast('You must add at least one task to the active sprint before starting the sprint'))
    const confirm = window.confirm('Are you sure you want to start the sprint?')
    if (!confirm) return
    startProjectSprintService(
      projectPath,
      project,
      firstColumn,
      setToasts,
      setPageLoading
    )
      .then(() => {
        navigate(`/projects/${projectID}/board`)
      })
  }

  const handleTaskClick = (e, taskID) => {
    e.stopPropagation()
    e.preventDefault()
    setSearchParams({ projectID, taskID })
  }

  return (
    <div className={`project-backlog ${!taskDetailsOpen ? 'full' : ''}`}>
      <DragDropContext
        onDragEnd={handleMoveTask}
        onDragStart={onDragStart}
      >
        <div className="backlog-flex">
          <div className="sprint-container backlog-section">
            <div className="title-bar">
              <div className="titles">
                <h5>{project?.sprintName}</h5>
                <span>{sprintTasksNum} task{sprintTasksNum !== 1 ? 's' : ''}</span>
              </div>
              <div className="actions">
                {
                  !isSprintActive &&
                  <AppButton
                    label="Start Sprint"
                    buttonType="outlineBtn small"
                    disabled={noSprintTasks}
                    onClick={() => handleStartSprint()}
                  />
                }
                <DropdownIcon
                  icon="far fa-ellipsis-h"
                  iconSize={16}
                  iconColor="var(--grayText)"
                  tooltip="Actions"
                  dimensions={27}
                  bgColor="var(--inputBg)"
                  showMenu={showTitlesMenu === 'sprint'}
                  setShowMenu={setShowTitlesMenu}
                  onClick={(e) => setShowTitlesMenu(showTitlesMenu === 'sprint' ? null : 'sprint')}
                  items={[
                    { label: "Edit Sprint", icon: "fas fa-pen", onClick: () => editSprint() },
                    { label: "Complete Sprint", icon: "fas fa-check-square", onClick: () => markCompleted() },
                  ]}
                />
              </div>
            </div>
            <div className={`sprint-list list-section ${noSprintTasks ? 'no-tasks' : ''} ${isDragging ? 'dragging' : ''}`}>
              <DndDropper droppableId="sprint">
                {
                  noSprintTasks ?
                    <h5>There are no tasks in this sprint. <br /><span>You can add tasks by dropping them here.</span></h5> :
                    sprintTasksList
                }
              </DndDropper>
            </div>
            {
              !isSprintActive &&
              <div className="task-adder">
                <AppReactSelect
                  placeholder={
                    <i
                      className={switchTaskType(newTaskType).icon}
                      style={{ color: switchTaskType(newTaskType).color }}
                    />
                  }
                  options={taskTypeOptions.map((option) => ({ value: option.value, icon: option.icon, iconColor: option.iconColor }))}
                  value={newTaskType}
                  onChange={(type) => setNewTaskType(type.value)}
                  hideDropdownArrow
                  centerOptions
                />
                <AppCoverInput
                  name="sprint-adder"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onCheck={() => addNewSprintTask()}
                  onCancel={() => handleCancelNewTask()}
                  onPressEnter={() => addNewSprintTask()}
                  showInput={showCoverInput}
                  setShowInput={setShowCoverInput}
                  cover={<h5>Add a task...</h5>}
                />
              </div>
            }
          </div>
          <div className="backlog-container backlog-section">
            <div className="title-bar">
              <div className="titles">
                <h5>Backlog</h5>
                <span>{backlogTasksNum} task{backlogTasksNum !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className={`backlog-list list-section ${noBacklogTasks ? 'no-tasks' : ''} ${isDragging ? 'dragging' : ''}`}>
              <DndDropper droppableId="backlog">
                {
                  noBacklogTasks ?
                    <h5>There are no tasks in the backlog. <br /><span>Add a new task below or dropn existing tasks here to get started.</span></h5> :
                    backlogTasksList
                }
              </DndDropper>
            </div>
            <div className="task-adder last">
              <AppReactSelect
                placeholder={
                  <i
                    className={switchTaskType(newTaskType).icon}
                    style={{ color: switchTaskType(newTaskType).color }}
                  />
                }
                options={taskTypeOptions.map((option) => ({ value: option.value, icon: option.icon, iconColor: option.iconColor }))}
                value={newTaskType}
                onChange={(type) => setNewTaskType(type.value)}
                hideDropdownArrow
                centerOptions
              />
              <AppCoverInput
                name="backlog-adder"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onCheck={() => addNewBacklogTask()}
                onPressEnter={() => addNewBacklogTask()}
                onCancel={() => handleCancelNewTask()}
                loading={newTaskLoading}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
                cover={<h5>Add a task title...</h5>}
              />
            </div>
          </div>
        </div>
      </DragDropContext>
      <BacklogTaskDetails
        activeTask={activeTask}
        taskDetailsOpen={taskDetailsOpen}
      />
    </div>
  )
}
