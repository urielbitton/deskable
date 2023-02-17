import {
  useOrgProjectBacklogTasks,
  useOrgProjectSprintTasks
} from "app/hooks/projectsHooks"
import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppCoverInput } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import BacklogTaskItem from "./BacklogTaskItem"
import './styles/ProjectBacklog.css'
import DragNDropper from "../ui/DragNDropper"
import { Draggable } from "react-beautiful-dnd"

export default function ProjectBacklog({ project }) {

  const projectID = useParams().projectID
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showTitlesMenu, setShowTitlesMenu] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const sprintTasks = useOrgProjectSprintTasks(projectID, project?.activeSprintID)
  const backlogTasks = useOrgProjectBacklogTasks(projectID)
  const sprintTasksNum = sprintTasks?.length
  const noSprintTasks = sprintTasks?.length === 0
  const sprintIsActive = project?.activeSprintID !== null

  const sprintTasksList = sprintTasks?.map((task, index) => {
    return <BacklogTaskItem
      key={index}
      task={task}
    />
  })

  const backlogTasksList = backlogTasks?.map((task, index) => {
    return <Draggable
      draggableId={task.taskID}
      index={task.backlogPosition}
    >
      {
        (provided, snapshot) => (
          <div
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
          >
            <BacklogTaskItem
              key={index}
              task={task}
            />
          </div>
        )
      }
    </Draggable>
  })

  const onDragStart = (result) => {
    setIsDragging(true)
  }

  const onDragEnd = (result) => {
    setIsDragging(false)
  }

  const handleCancelNewTask = () => {

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
      <DragNDropper
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        droppableId="backlog"
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
                  sprintTasksList
              }
            </div>
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
          </div>
          <div className="backlog-container backlog-section">
            <div className="title-bar">
              <div className="titles">
                <h5>Backlog</h5>
                <span>0 tasks</span>
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
            <div className="backlog-list list-section">
              {backlogTasksList}
            </div>
            <div className="task-adder">
              <AppCoverInput
                name="backlog-adder"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onCheck={() => addNewBacklogTask()}
                onCancel={() => handleCancelNewTask()}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
                cover={<h5><i className="fal fa-plus" />Add a task...</h5>}
              />
            </div>
          </div>
        </div>
      </DragNDropper>
      <div className="task-details">

      </div>
    </div>
  )
}
