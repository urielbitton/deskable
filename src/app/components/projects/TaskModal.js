import { switchTaskType } from "app/data/projectsData"
import { useOrgProjectTask } from "app/hooks/projectsHooks"
import React, { useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppModal from "../ui/AppModal"
import './styles/TaskModal.css'
import TaskContentDetails from "./TaskContentDetails"

export default function TaskModal(props) {

  const { showModal, setShowModal } = props
  const [showDocViewer, setShowDocViewer] = useState(false)
  const [activeDocFile, setActiveDocFile] = useState('')
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesUserIDs, setLikesUserIDs] = useState([])
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const taskID = searchParams.get('taskID')
  const projectID = searchParams.get('projectID')
  const task = useOrgProjectTask(projectID, taskID)

  const resetTaskData = () => {
    setSearchParams('')
    setShowDocViewer(false)
    setActiveDocFile(null)
    setShowLikesModal(false)
    setLikesUserIDs([])
    setShowCommentEditor(false)
    setCommentText('')
    setShowCoverInput(null)
    setShowModal(false)
  }

  return (
    <AppModal
      showModal={showModal} 
      setShowModal={setShowModal}
      onClose={() => resetTaskData()}
      label={<>
        <span
          className="icon"
          style={{ background: switchTaskType(task?.taskType).color }}
        >
          <i className={switchTaskType(task?.taskType).icon} />
        </span>
        <span className="title">{task?.taskNum}</span>
      </>}
      portalClassName="view-task-modal"
    >
      <TaskContentDetails
        task={task}
        setShowModal={setShowModal}
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
    </AppModal >
  )
}

