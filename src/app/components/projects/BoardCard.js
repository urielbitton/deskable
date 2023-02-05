import { switchTaskType } from "app/data/projectsData"
import { useDocsCount } from "app/hooks/userHooks"
import React, { useState } from 'react'
import AppBadge from "../ui/AppBadge"
import DropdownIcon from "../ui/DropDownIcon"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import './styles/BoardCard.css'

export default function BoardCard(props) {

  const { taskID, title, taskNum, taskType, assigneesIDs,
    projectID } = props.task
  const { dragging, tasksPath } = props
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const filesNum = useDocsCount(`${tasksPath}/${taskID}/files`)
  const commentsNum = useDocsCount(`${tasksPath}/${taskID}/comments`)
  // const comments = useProjectTaskComments(projectID, taskID)

  return (
    <div className="board-card">
      <div className="top">
        <div className="header">
          <h5>{title}</h5>
          <DropdownIcon
            icon="far fa-ellipsis-h"
            iconSize="14px"
            iconColor="var(--grayText)"
            dimensions={22}
            showMenu={showHeaderMenu}
            setShowMenu={setShowHeaderMenu}
            onClick={() => setShowHeaderMenu(prev => !prev)}
            items={[
              { label: 'Edit Task', icon: 'fas fa-pen', onClick: () => { } },
              { label: 'Delete Task', icon: 'fas fa-trash', onClick: () => { } },
              { label: 'Move to Backlog', icon: 'fas fa-clipboard-list', onClick: () => { } },
              { label: 'Move to Archive', icon: 'fas fa-archive', onClick: () => { } },
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
            fontSize="11px"
          />
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
            {filesNum} <i className="fas fa-comment" />
          </span>
          <span>
            {commentsNum} <i className="fas fa-paperclip" />
          </span>
        </div>
      </div>
    </div>
  )
}
