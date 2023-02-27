import React from 'react'
import './styles/ProjectTaskCard.css'
import { convertClassicDateAndTime, convertAlgoliaDate } from 'app/utils/dateUtils'
import { switchTaskPriority, switchTaskType } from "app/data/projectsData"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import useUser, { useDocsCount } from "app/hooks/userHooks"
import { Link } from "react-router-dom"
import IconContainer from "../ui/IconContainer"
import Avatar from "../ui/Avatar"

export default function ProjectTaskCard(props) {

  const { title, dateCreated, taskType, assigneesIDs,
    taskNum, priority, points, orgID, projectID, taskID,
    inSprint, status, reporterID } = props.task
  const commentsPath = `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/comments`
  const filesPath = `organizations/${orgID}/projects/${projectID}/tasks/${taskID}/files`
  const commentsNum = useDocsCount(commentsPath)
  const filesNum = useDocsCount(filesPath)
  const taskLocation = inSprint ? 'Active Sprint' : status === 'backlog' ? 'Backlog' : 'Completed'
  const reporter = useUser(reporterID)

  return (
    <Link
      className="project-task-card"
      to={`/projects/${projectID}/tasks/${taskID}`}
      key={taskID}
    >
      <div className="titles">
        <div className="texts">
          <h5>{title}</h5>
          <small>{convertClassicDateAndTime(convertAlgoliaDate(dateCreated))}</small>
        </div>
        <div className="assignees">
          <MultipleUsersAvatars
            userIDs={assigneesIDs}
            maxAvatars={10}
            avatarDimensions={27}
          />
        </div>
      </div>
      <div className="details">
        <div className="info">
          <span className="task-num">#<span>{taskNum}</span></span>
          <span>
            <IconContainer
              dimensions={17}
              icon={switchTaskType(taskType).icon}
              bgColor={switchTaskType(taskType).color}
              iconColor="#fff"
              iconSize="10px"
              round={false}
            />
            <span className="cap">{taskType}</span>
          </span>
          <span title="Task Priority">
            <i
              className={`${switchTaskPriority(priority).icon} priority-icon`}
              style={{ color: switchTaskPriority(priority).color }}
            />
            <span className="cap">{priority}</span>
          </span>
          <span className="points">
            <i className="fas fa-gamepad" />
            <span>{points}</span>
          </span>
          <span>
            <i className="fas fa-map-marker-alt" />
            {taskLocation}
          </span>
          {
            reporterID &&
            <div className="reporter">
              <i className="fas fa-bullhorn" />
              <Avatar
                src={reporter?.photoURL}
                dimensions={22}
                title={'Reporter: ' + reporter?.firstName + ' ' + reporter?.lastName}

              />
            </div>
          }
        </div>
        <div className="stats">
          <span title={`${commentsNum} comments`}>
            <i className="far fa-comment" />
            {commentsNum}
          </span>
          <span title={`${filesNum} files`}>
            <i className="far fa-paperclip" />
            {filesNum}
          </span>
        </div>
      </div>
    </Link>
  )
}
