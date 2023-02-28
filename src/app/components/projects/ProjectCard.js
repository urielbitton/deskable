import { useDocsCount } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import Avatar from "../ui/Avatar"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import './styles/ProjectCard.css'

export default function ProjectCard(props) {

  const { myOrgID } = useContext(StoreContext)
  const { members, name, photoURL, sprintNumber,
    lastActive, projectID } = props.project
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const tasksNum = useDocsCount(tasksPath)
  const openTasksNum = 0
  const closedTasksNum = 0

  return (
    <Link
      to={`/projects/${projectID}/backlog`}
      className="project-card"
      key={projectID}
    >
      <div className="header">
        <Avatar
          src={photoURL}
          alt={name}
          dimensions={26}
        />
        <h5>{name}</h5>
      </div>
      <div className="content">
        <div>
          <h6>Members</h6>
          <MultipleUsersAvatars
            userIDs={members}
            maxAvatars={4}
            avatarDimensions={25}
          />
        </div>
        <div>
          <h6>Total Tasks</h6>
          <span>{tasksNum}</span>
        </div>
        <div>
          <h6>Open Tasks</h6>
          <span>{openTasksNum}</span>
        </div>
        <div>
          <h6>Completed Tasks</h6>
          <span>{closedTasksNum}</span>
        </div>
      </div>
      <div className="footer-info">
        <h6>
          <span>Sprint #</span>
          {sprintNumber}
        </h6>
        <h6 className="right">
          <span>Last Active</span>
          {convertClassicDate(lastActive?.toDate())}
        </h6>
      </div>
    </Link>
  )
}
