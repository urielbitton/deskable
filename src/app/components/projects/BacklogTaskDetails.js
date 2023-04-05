import { switchTaskType } from "app/data/projectsData"
import React, { useContext, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"
import './styles/BacklogTaskDetails.css'
import TaskContentDetails from "./TaskContentDetails"
import { deleteProjectTaskService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"

export default function BacklogTaskDetails(props) {

  const { setPageLoading, myOrgID, setToasts } = useContext(StoreContext)
  const { activeTask } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const [showTaskMenu, setShowTaskMenu] = useState(null)
  const [showDocViewer, setShowDocViewer] = useState(false)
  const [activeDocFile, setActiveDocFile] = useState('')
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesUserIDs, setLikesUserIDs] = useState([])
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const projectID = searchParams.get('projectID')
  const taskPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const taskID = activeTask?.taskID

  const deleteTask = () => {
    const confirm = window.confirm('Are you sure you want to delete this task?')
    if (!confirm) return
    deleteProjectTaskService(
      taskPath, 
      taskID, 
      setPageLoading, 
      setToasts
    )
    .then(() => {
      handleClose()
    })
  }

  const handleClose = () => {
    setShowTaskMenu(null)
    setSearchParams('')
  }

  return activeTask ? (
    <div 
      className="task-details-container"
      key={activeTask.taskID}
    >
      <div className="header">
        <div className="task-num">
          <span
            className="icon"
            style={{ background: switchTaskType(activeTask?.taskType).color }}
          >
            <i className={switchTaskType(activeTask?.taskType).icon} />
          </span>
          <h5>{activeTask.taskNum}</h5>
        </div>
        <div className="actions">
          <DropdownIcon
            iconColor="var(--darkGrayText)"
            dimensions={30}
            iconSize={19}
            round={false}
            tooltip="Actions"
            showMenu={showTaskMenu === activeTask.taskID}
            setShowMenu={setShowTaskMenu}
            onClick={(e) => setShowTaskMenu(showTaskMenu === activeTask.taskID ? null : activeTask.taskID)}
            items={[
              { label: "Delete", icon: "fas fa-trash", onClick: () => deleteTask() },
            ]}
          />
          <IconContainer
            icon="fal fa-times"
            iconColor="var(--darkGrayText)"
            dimensions={30}
            iconSize={19}
            round={false}
            onClick={() => handleClose()}
            tooltip="Close"
            className="close-icon"
          />
        </div>
      </div>
      <TaskContentDetails
        task={activeTask}
        showDocViewer={showDocViewer}
        setShowDocViewer={setShowDocViewer}
        activeDocFile={activeDocFile}
        setActiveDocFile={setActiveDocFile}
        showLikesModal={showLikesModal}
        setShowLikesModal={setShowLikesModal}
        likesUserIDs={likesUserIDs}
        setLikesUserIDs={setLikesUserIDs}
        showCommentEditor={showCommentEditor}
        setShowCommentEditor={setShowCommentEditor}
        commentText={commentText}
        setCommentText={setCommentText}
        showCoverInput={showCoverInput}
        setShowCoverInput={setShowCoverInput}
      />
    </div>
  ) : null
}
