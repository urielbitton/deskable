import { switchTaskPriority, switchTaskType } from "app/data/projectsData"
import React from 'react'
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import './styles/BacklogTaskItem.css'

export default function BacklogTaskItem(props) {

  const { title, taskType, assigneesIDs, taskNum,
    priority, points, taskID } = props.task
  const { onClick, isActive } = props

  return (
    <div 
      className={`backlog-task-item ${isActive ? 'active' : ''}`}
      onClick={(e) => onClick && onClick(e)}
    >
      <div className="left-titles">
        <i
          className={switchTaskType(taskType).icon}
          title={taskType.charAt(0).toUpperCase() + taskType.slice(1)}
          style={{ color: switchTaskType(taskType).color }}
        />
        <h6>{title}</h6>
      </div>
      <div className="right-details">
        <MultipleUsersAvatars
          userIDs={assigneesIDs}
          maxAvatars={3}
          avatarDimensions={25}
        />
        <span className="task-num">{taskNum}</span>
        <i
          className={`${switchTaskPriority(priority).icon} priority-icon`}
          style={{ color: switchTaskPriority(priority).color }}
        />
        <span className="points">
          <i className="fas fa-gamepad" />
          {points}
        </span>
      </div>
    </div>
  )
}
