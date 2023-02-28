import { switchTaskPriority, switchTaskType } from "app/data/projectsData"
import { useDocsCount } from "app/hooks/userHooks"
import { moveTaskToBacklogService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import AppBadge from "../ui/AppBadge"
import DropdownIcon from "../ui/DropDownIcon"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import './styles/BoardCard.css'

export default function BoardCard(props) {

  const { setToasts, myOrgID, myUserID } = useContext(StoreContext)
  const { taskID, title, taskNum, taskType, assigneesIDs,
    priority, points } = props.task
  const { tasksPath, handleDeleteTask, dragging, setIsDragging,
    handleOpenTask } = props
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const filesNum = useDocsCount(`${tasksPath}/${taskID}/files`)
  const commentsNum = useDocsCount(`${tasksPath}/${taskID}/comments`)

  const moveToBacklog = () => {
    moveTaskToBacklogService(
      tasksPath, 
      myUserID, 
      taskID, 
      setToasts
    )
  }

  const archiveTask = () => {

  }

  useEffect(() => {
    setIsDragging(dragging)
    return () => setIsDragging(false)
  }, [dragging])

  return (
    <div
      className="board-card"
      onClick={() => handleOpenTask(taskID)}
      key={taskID}
    >
      <div className="top">
        <div className="header">
          <h5>{title}</h5>
          <DropdownIcon
            icon="far fa-ellipsis-h"
            iconSize="15px"
            iconColor="var(--grayText)"
            dimensions={24}
            showMenu={showHeaderMenu}
            setShowMenu={setShowHeaderMenu}
            onClick={(e) => {
              e.stopPropagation()
              setShowHeaderMenu(prev => !prev)
            }}
            items={[
              { label: 'Edit Task', icon: 'fas fa-pen', onClick: () => handleOpenTask(taskID) },
              { label: 'Delete Task', icon: 'fas fa-trash', onClick: () => handleDeleteTask(taskID) },
              { label: 'Move to Backlog', icon: 'fas fa-clipboard-list', onClick: () => moveToBacklog() },
              { label: 'Archive Task', icon: 'fas fa-archive', onClick: () => archiveTask() },
            ]}
          />
        </div>
        <div className="content">
          <small>{taskNum}</small>
          <AppBadge
            label={taskType}
            color={switchTaskType(taskType).color}
            bgColor={`${switchTaskType(taskType).color}22`}
            icon={switchTaskType(taskType).icon}
            iconSize="10px"
            fontSize="12px"
          />
          <span
            className="task-priority"
            title={`Priority: ${priority}`}
          >
            <i
              className={switchTaskPriority(priority)?.icon}
              style={{ color: switchTaskPriority(priority)?.color }}
            />
          </span>
          {
            points > 0 &&
            <span 
              className="task-points"
              title={`Task points: ${points}`}
            >
              <i className="fas fa-gamepad" />
              <small>{points}</small>
            </span>
          }
        </div>
      </div>
      <div className="footer">
        <MultipleUsersAvatars
          userIDs={assigneesIDs}
          maxAvatars={4}
          avatarDimensions={25}
        />
        <div className="stats">
          <span>
            {commentsNum} <i className="fas fa-comment" />
          </span>
          <span>
            {filesNum} <i className="fas fa-paperclip" />
          </span>
        </div>
      </div>
    </div>
  )
}
