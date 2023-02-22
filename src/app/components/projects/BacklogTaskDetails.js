import { switchTaskType } from "app/data/projectsData"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"
import './styles/BacklogTaskDetails.css'
import TaskContentDetails from "./TaskContentDetails"

export default function BacklogTaskDetails(props) {

  const { myOrgID, setToasts, myUserID } = useContext(StoreContext)
  const { activeTask, setShowTaskDetails } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const [showTaskMenu, setShowTaskMenu] = useState(null)
  const [showDocViewer, setShowDocViewer] = useState(false)
  const [activeDocFile, setActiveDocFile] = useState('')
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesUserIDs, setLikesUserIDs] = useState([])
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const tasksPath = `organizations/${myOrgID}/projects/${activeTask?.projectID}/tasks`

  const deleteTask = () => {

  }

  const handleClose = () => {
    setShowTaskMenu(null)
    setShowTaskDetails(null)
    setSearchParams('')
  }

  return activeTask ? (
    <div className="task-details-container">
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
