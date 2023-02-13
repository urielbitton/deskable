import useUser from "app/hooks/userHooks"
import { getTimeAgo } from "app/utils/dateUtils"
import React from 'react'
import Avatar from "../ui/Avatar"
import './styles/TaskEvent.css'

export default function TaskEvent(props) {

  const { ownerID, dateCreated, title, icon } = props.event
  const user = useUser(ownerID)

  return (
    <div className="task-event-item">
      <Avatar
        src={user?.photoURL}
        alt={`${user?.firstName} ${user?.lastName}`}
        dimensions={30}
      />
      <div className="texts">
        <div className="titles">
          <h6>{user?.firstName} {user?.lastName}</h6>
          <span>{getTimeAgo(dateCreated?.toDate())}</span>
        </div>
        <div className="content">
          <i className={icon}></i>
          <p dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </div>
    </div>
  )
}
