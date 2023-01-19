import { infoToast } from "app/data/toastsTemplates"
import { deleteTaskService, updateTaskService } from "app/services/calendarServices"
import { StoreContext } from "app/store/store"
import { convertClassicTime } from "app/utils/dateUtils"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import DropdownIcon from "../ui/DropDownIcon"
import './styles/TaskItem.css'

export default function TaskItem(props) {

  const { setToasts, myUserID } = useContext(StoreContext)
  const { dateCreated, title, isDone, taskID } = props.task
  const [showTaskMenu, setShowTaskMenu] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const editTask = () => {
    setEditMode(true)
    setTaskTitle(title)
  }

  const saveTask = () => {
    if (!taskTitle) return setToasts(infoToast('Please enter a title for the task'))
    updateTaskService(
      myUserID,
      {
        taskID,
        title: taskTitle,
        isDone,
      },
      setToasts,
      setLoading
    )
      .then(() => {
        setEditMode(false)
        setTaskTitle('')
      })
  }

  const deleteTask = () => {
    const confirm = window.confirm('Are you sure you want to delete this task?')
    if (!confirm) return setToasts(infoToast('Task not deleted.'))
    deleteTaskService(
      myUserID,
      taskID,
      setToasts,
      setLoading
    )
  }

  const toggleDone = () => {
    updateTaskService(
      myUserID,
      {
        taskID,
        title,
        isDone: !isDone,
      },
      setToasts,
      setLoading
    )
  }

  useEffect(() => {
    if(editMode) 
      inputRef.current.focus()
  },[editMode])

  return (
    <div className={`task-item ${isDone ? 'is-done' : ''}`}>
      <div className="task-info">
        {
          !loading ?
            <i className="far fa-tasks" /> :
            <i className="fas fa-spinner fa-spin" />
        }
        <div className="task-info-text">
          {
            !editMode ?
              <>
                <h5 title={title}>{truncateText(title, 60)}</h5>
                <h6>
                  {convertClassicTime(dateCreated?.toDate())}
                  {
                    isDone &&
                    <span>- Done</span>
                  }
                </h6>
              </> :
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveTask()}
                ref={inputRef}
              />
          }
        </div>
      </div>
      <div className="task-actions">
        <DropdownIcon
          iconColor="var(--lightGrayText)"
          tooltip="Actions"
          showMenu={showTaskMenu === taskID}
          setShowMenu={setShowTaskMenu}
          onClick={(e) => {
            e.stopPropagation()
            setShowTaskMenu(showTaskMenu === taskID ? null : taskID)
          }}
          items={[
            { label: "Edit", icon: "fas fa-pen", onClick: () => editTask() },
            { label: "Delete", icon: "fas fa-trash", onClick: () => deleteTask() },
            { label: isDone ? "Mark As Not Done" : 'Mark As Done', icon: isDone ? "fas fa-times" : "fas fa-check", onClick: () => toggleDone() },
          ]}
        />
      </div>
    </div>
  )
}
