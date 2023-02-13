import useUser from "app/hooks/userHooks"
import { deleteProjectTaskEvent } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { getTimeAgo } from "app/utils/dateUtils"
import React, { useContext, useEffect } from 'react'
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import './styles/TaskEvent.css'

export default function TaskEvent(props) {

  const { myUserID, setToasts } = useContext(StoreContext)
  const { ownerID, dateCreated, title, icon, eventID } = props.event
  const { task, eventsPath, showEventMenu, setShowEventMenu } = props
  const user = useUser(ownerID)
  const isEventCreator = task?.creatorID === myUserID

  const deleteEvent = () => {
    if (!isEventCreator) return
    const confirm = window.confirm("Are you sure you want to delete this event?")
    if (!confirm) return
    deleteProjectTaskEvent(eventsPath, eventID, setToasts)
  }

  useEffect(() => {
    if (showEventMenu) {
      window.onclick = () => setShowEventMenu(null)
    }
  }, [showEventMenu])

  return (
    <div className="task-event-item">
      <Avatar
        src={user?.photoURL}
        alt={`${user?.firstName} ${user?.lastName}`}
        dimensions={30}
      />
      <div className="texts">
        <div className="titles">
          <div className="left">
            <h6>{user?.firstName} {user?.lastName}</h6>
            <span>{getTimeAgo(dateCreated?.toDate())}</span>
          </div>
          {
            isEventCreator &&
            <DropdownIcon
              icon="far fa-ellipsis-h"
              iconColor="var(--grayText)"
              iconSize={15}
              dimensions={25}
              tooltip="Actions"
              showMenu={showEventMenu === eventID}
              setShowMenu={showEventMenu}
              onClick={() => setShowEventMenu(showEventMenu === eventID ? null : eventID)}
              items={[
                { label: "Delete", icon: "fas fa-trash", onClick: () => deleteEvent() },
              ]}
            />
          }
        </div>
        <div className="content">
          <i className={icon}></i>
          <p dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </div>
    </div>
  )
}
