import { switchTaskType } from "app/data/projectsData"
import { useOrgProjectTask, useOrgProjectTaskComments, 
  useOrgProjectTaskFiles } from "app/hooks/projectsHooks"
import { useDocsCount } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppModal from "../ui/AppModal"
import FileUploadBtn from "../ui/FileUploadBtn"
import './styles/TaskModal.css'
import TaskComment from "./TaskComment"
import TaskAttachment from "./TaskAttachment"
import { uploadMultipleFilesToFireStorage } from "app/services/storageServices"
import { errorToast } from "app/data/toastsTemplates"
import { uploadOrgProjectTaskFiles } from "app/services/projectsServices"

export default function TaskModal(props) {

  const { myOrgID, setToasts } = useContext(StoreContext)
  const { showModal, setShowModal } = props
  const [commentsLimit, setCommentsLimit] = useState(10)
  const [filesLimit, setFilesLimit] = useState(5)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const taskID = searchParams.get('taskID')
  const projectID = searchParams.get('projectID')
  const task = useOrgProjectTask(projectID, taskID)
  const comments = useOrgProjectTaskComments(projectID, taskID, commentsLimit)
  const attachments = useOrgProjectTaskFiles(projectID, taskID, filesLimit)
  const commentsNum = useDocsCount(`organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/comments`)
  const filesNum = useDocsCount(`organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/files`)
  const filesStoragePath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/files`
  const maxFileSize = 1024 * 1024 * 5
  const maxFilesNum = 5

  const attachmentsList = attachments?.map((file, index) => {
    return <TaskAttachment
      key={index}
      file={file}
    />
  })

  const commentsList = comments?.map((comment, index) => {
    return <TaskComment
      key={index}
      comment={comment}
    />
  })

  const resetTaskData = () => {
    setSearchParams('')
  }

  const handleFileUpload = (e) => {
    const files = e.target.files
    if(!files) return
    if(files?.length > maxFilesNum) 
      return setToasts(errorToast(`You can't upload more than ${maxFilesNum} files at a time.`))
    Array.from(files).forEach(file => {
      if(file.size > maxFileSize)
        return setToasts(errorToast(`File size can't exceed ${maxFileSize / 1024 / 1024} MB.`))
    })
    setUploadLoading(true)
    uploadOrgProjectTaskFiles(
      myOrgID, 
      projectID, 
      taskID, 
      Array.from(files), 
      filesStoragePath, 
      setUploadLoading, 
      setToasts
    )
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
      {
        task &&
        <div className="view-task-content">
          <div className="task-content">
            <h3>{task.title}</h3>
            <div className="btn-group">
              <FileUploadBtn
                accept="image/*, video/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                onChange={(e) => handleFileUpload(e)}
                label="Attach Files"
                iconLeft="fas fa-paperclip"
                classic
                border="1px solid #eee"
              />
            </div>
            <div className="description-section">
              <h5>Description</h5>
              <p>{task.description}</p>
            </div>
            <div className="attachments-section">
              <h5>Attachments {filesNum > 0 && `(${filesNum})`}</h5>
              <div className="attachments-grid">
                {attachmentsList}
              </div>
              {
                uploadLoading &&
                <i className="fas fa-spinner fa-spin" />
              }
              {
                filesNum > filesLimit &&
                <small
                  className="load-more"
                  onClick={() => setFilesLimit(filesLimit + 5)}
                >
                  Load more
                </small>
              }
            </div>
            <div className="comments-section">
              <h5>Comments {commentsNum > 0 && `(${commentsNum})`}</h5>
              <div className="comments-list">
                {commentsList}
              </div>
              {
                commentsNum > commentsLimit &&
                <small
                  className="load-more"
                  onClick={() => setCommentsLimit(commentsLimit + 10)}
                >
                  Load more
                </small>
              }
            </div>
          </div>
          <div className="task-details">
            <h5>Task Details</h5>
          </div>
        </div>
      }
    </AppModal>
  )
}
