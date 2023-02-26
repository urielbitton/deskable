import { switchTaskType } from "app/data/projectsData"
import { useOrgProjectTask } from "app/hooks/projectsHooks"
import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import DropdownIcon from "../ui/DropDownIcon"
import './styles/ProjectTaskPage.css'
import TaskContentDetails from "./TaskContentDetails"

export default function ProjectTaskPage() {

  const taskID = useParams().taskID
  const projectID = useParams().projectID
  const task = useOrgProjectTask(projectID, taskID)
  const [showTaskMenu, setShowTaskMenu] = useState(null)
  const [showDocViewer, setShowDocViewer] = useState(false)
  const [activeDocFile, setActiveDocFile] = useState('')
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesUserIDs, setLikesUserIDs] = useState([])
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)

  const deleteTask = () => {

  }

  return task ? (
    <div className="project-task-page">
      <div className="task-header">
        <div className="task-num">
          <span
            className="icon"
            style={{ background: switchTaskType(task?.taskType).color }}
          >
            <i className={switchTaskType(task?.taskType).icon} />
          </span>
          <h5>{task.taskNum}</h5>
        </div>
        <div className="actions">
          <DropdownIcon
            iconColor="var(--darkGrayText)"
            dimensions={30}
            iconSize={19}
            round={false}
            tooltip="Actions"
            showMenu={showTaskMenu === task.taskID}
            setShowMenu={setShowTaskMenu}
            onClick={(e) => setShowTaskMenu(showTaskMenu === task.taskID ? null : task.taskID)}
            items={[
              { label: "Delete", icon: "fas fa-trash", onClick: () => deleteTask() },
            ]}
          />
        </div>
      </div>
      <TaskContentDetails
        task={task}
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
  ) :
  null
}
