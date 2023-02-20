import {
  useOrgProjectBacklogTasks,
  useOrgProjectFirstColumn,
  useOrgProjectSprintTasks
} from "app/hooks/projectsHooks"
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppCoverInput } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import BacklogTaskItem from "./BacklogTaskItem"
import './styles/ProjectBacklog.css'
import DraggableItem from "../ui/DraggableItem"
import { DragDropContext } from "react-beautiful-dnd"
import DndDropper from "../ui/DndDropper"
import { moveBacklogTaskService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"

export default function ProjectBacklog({ project }) {

  const { myOrgID, setToasts } = useContext(StoreContext)
  const projectID = useParams().projectID
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showTitlesMenu, setShowTitlesMenu] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const sprintTasks = useOrgProjectSprintTasks(projectID, project?.activeSprintID)
  const backlogTasks = useOrgProjectBacklogTasks(projectID)
  const firstColumn = useOrgProjectFirstColumn(projectID)
  const sprintTasksNum = sprintTasks?.length
  const backlogTasksNum = backlogTasks?.length
  const noSprintTasks = sprintTasks?.length === 0
  const sprintIsActive = project?.activeSprintID !== null
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`

  const sprintTasksList = sprintTasks?.map((task, index) => {
    return <DraggableItem
      key={task.taskID} //key cannot be index, must be unique id
      draggableId={task.taskID}
      index={task.backlogPosition}
    >
      <BacklogTaskItem
        key={index}
        task={task}
      />
    </DraggableItem>
  })

  const backlogTasksList = backlogTasks?.map((task, index) => {
    return <DraggableItem
      key={task.taskID} 
      draggableId={task.taskID}
      index={task.backlogPosition}
    >
      <BacklogTaskItem
        key={index}
        task={task}
      />
    </DraggableItem>
  })

  const onDragStart = (result) => {
    setIsDragging(true)
  }

  const handleMoveTask = (result) => {
    if(!result.destination) {
      setIsDragging(false)
      return console.log('non droppable zone')
    }
    setIsDragging(false)
    const taskID = result.draggableId
    const source = result.source
    const destination = result.destination
    if (sprintIsActive) {
      moveBacklogTaskService(tasksPath, taskID, source, destination, firstColumn, setToasts)
    }
    //when planning a sprint - not same behaviour as when sprint is active
    else {

    }
  }

  const handleCancelNewTask = () => {
    setShowCoverInput(null)
    setNewTaskTitle('')
  }

  const addNewBacklogTask = () => {

  }

  const addNewSprintTask = () => {

  }

  const editSprint = () => {

  }

  const deleteSprint = () => {

  }

  const markCompleted = () => {

  }

  const handleStartSprint = () => {

  }

  return (
    <div className={`project-backlog ${!showTaskDetails ? 'full' : ''}`}>
      <DragDropContext
        onDragEnd={handleMoveTask}
        onDragStart={onDragStart}
      >
        <div className="backlog-flex">
          <div className="sprint-container backlog-section">
            <div className="title-bar">
              <div className="titles">
                <h5>Test Sprint 1</h5>
                <span>{sprintTasksNum} task{sprintTasksNum !== 1 ? 's' : ''}</span>
              </div>
              <div className="actions">
                {
                  !sprintIsActive &&
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
                    { label: "Delete Sprint", icon: "fas fa-trash", onClick: () => deleteSprint() },
                    { label: "Mark As Completed", icon: "fas fa-check-square", onClick: () => markCompleted() },
                  ]}
                />
              </div>
            </div>
            <div className={`sprint-list list-section ${noSprintTasks ? 'no-tasks' : ''} ${isDragging ? 'dragging' : ''}`}>
              {
                noSprintTasks ?
                  <h5>There are no tasks in this sprint. <br /><span>You can add tasks by dropping them here.</span></h5> :
                  <DndDropper droppableId="sprint">
                    {sprintTasksList}
                  </DndDropper>
              }
            </div>
            {
              !sprintIsActive &&
              <div className="task-adder">
                <AppCoverInput
                  name="sprint-adder"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onCheck={() => addNewSprintTask()}
                  onCancel={() => handleCancelNewTask()}
                  showInput={showCoverInput}
                  setShowInput={setShowCoverInput}
                  cover={<h5><i className="fal fa-plus" />Add a task...</h5>}
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
              <DropdownIcon
                icon="far fa-ellipsis-h"
                iconSize={16}
                iconColor="var(--grayText)"
                tooltip="Actions"
                dimensions={27}
                bgColor="var(--inputBg)"
                showMenu={showTitlesMenu === 'backlog'}
                setShowMenu={setShowTitlesMenu}
                onClick={(e) => setShowTitlesMenu(showTitlesMenu === 'backlog' ? null : 'backlog')}
                items={[]}
              />
            </div>
            <div className={`backlog-list list-section ${isDragging ? 'dragging' : ''}`}>
              <DndDropper droppableId="backlog">
                {backlogTasksList}
              </DndDropper>
            </div>
            <div className="task-adder">
              <AppCoverInput
                name="backlog-adder"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onCheck={() => addNewBacklogTask()}
                onPressEnter={() => addNewBacklogTask()}
                onCancel={() => handleCancelNewTask()}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
                cover={<h5><i className="fal fa-plus" />Add a task...</h5>}
              />
            </div>
          </div>
        </div>
      </DragDropContext>
      <div className="task-details">

      </div>
    </div>
  )
}
