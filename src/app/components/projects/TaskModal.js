import {
  switchTaskPriority, switchTaskType,
  taskPriorityOptions
} from "app/data/projectsData"
import {
  useOrgProjectColumns,
  useOrgProjectTask, useOrgProjectTaskComments,
  useOrgProjectTaskFiles
} from "app/hooks/projectsHooks"
import { useDocsCount } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppModal from "../ui/AppModal"
import FileUploadBtn from "../ui/FileUploadBtn"
import './styles/TaskModal.css'
import TaskComment from "./TaskComment"
import TaskAttachment from "./TaskAttachment"
import { errorToast, infoToast } from "app/data/toastsTemplates"
import {
  createOrgProjectTaskCommentService,
  deleteProjectTaskService,
  uploadOrgProjectTaskFiles
} from "app/services/projectsServices"
import DocViewerModal from "./DocViewerModal"
import LikesStatsModal from "../ui/LikesStatsModal"
import Avatar from "../ui/Avatar"
import WysiwygEditor from "../ui/WysiwygEditor"
import AppButton from "../ui/AppButton"
import { AppCoverSelect, AppInput } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import OrgUsersTagInput from "./OrgUsersTagInput"

export default function TaskModal(props) {

  const { myOrgID, myUserID, myUserImg, setToasts,
    setPageLoading } = useContext(StoreContext)
  const { showModal, setShowModal } = props
  const [commentsLimit, setCommentsLimit] = useState(10)
  const [filesLimit, setFilesLimit] = useState(5)
  const [eventsLimit, setEventsLimit] = useState(10)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [addCommentLoading, setAddCommentLoading] = useState(false)
  const [showDocViewer, setShowDocViewer] = useState(false)
  const [activeDocFile, setActiveDocFile] = useState('')
  const [activeEventsTab, setActiveEventsTab] = useState('comments')
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesUserIDs, setLikesUserIDs] = useState([])
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskAddTo, setTaskAddTo] = useState('')
  const [taskReporter, setTaskReporter] = useState('')
  const [taskPoints, setTaskPoints] = useState('')
  const [showStatusInput, setShowStatusInput] = useState(false)
  const [showPriorityInput, setShowPriorityInput] = useState(false)
  const [showAddToInput, setShowAddToInput] = useState(false)
  const [showReporterInput, setShowReporterInput] = useState(false)
  const [showAssigneesInput, setShowAssigneesInput] = useState(false)
  const [assigneesQuery, setAssigneesQuery] = useState('')
  const [showPointsInput, setShowPointsInput] = useState(false)
  const [showTaskMenu, setShowTaskMenu] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const commentEditorRef = useRef(null)
  const taskID = searchParams.get('taskID')
  const projectID = searchParams.get('projectID')
  const task = useOrgProjectTask(projectID, taskID)
  const columns = useOrgProjectColumns(projectID)
  const comments = useOrgProjectTaskComments(projectID, taskID, commentsLimit)
  const attachments = useOrgProjectTaskFiles(projectID, taskID, filesLimit)
  const commentsNum = useDocsCount(`organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/comments`)
  const eventsNum = useDocsCount(`organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/events`)
  const filesNum = useDocsCount(`organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/files`)
  const filesStoragePath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/files`
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const maxFileSize = 1024 * 1024 * 5
  const maxFilesNum = 5
  const orgAlgoliaFilters = `activeOrgID:${myOrgID}`

  const columnsOptions = columns?.map((column) => {
    return {
      label: column.title,
      value: column.title,
    }
  })

  const addToOptions = [
    { label: 'Add to Sprint', value: 'sprint', disabled: task?.inSprint },
    { label: 'Add to Backlog', value: 'backlog', disabled: !task?.inSprint },
  ]

  const taskPriorityIconRender = Array.apply(null, { length: switchTaskPriority(task?.priority)?.loop })
    ?.map((_, index) => {
      return <i
        key={index}
        className={switchTaskPriority(task?.priority)?.icon}
        style={{ color: switchTaskPriority(task?.priority)?.color }}
      />
    })

  const assigneesList = task?.assigneesIDs?.map((assignee, index) => {
    return 
  })

  const handleFileClick = (file) => {
    setActiveDocFile(file)
    setShowDocViewer(true)
  }

  const attachmentsList = attachments?.map((file, index) => {
    return <TaskAttachment
      key={index}
      file={file}
      setUploadLoading={setUploadLoading}
      onClick={handleFileClick}
    />
  })

  const commentsList = comments?.map((comment, index) => {
    return <TaskComment
      key={index}
      comment={comment}
      setLikesUserIDs={setLikesUserIDs}
      setShowLikesModal={setShowLikesModal}
    />
  })

  const resetTaskData = () => {
    setSearchParams('')
    setShowDocViewer(false)
    setActiveDocFile(null)
    setShowLikesModal(false)
    setLikesUserIDs([])
    setShowCommentEditor(false)
    setCommentText('')
    setShowStatusInput(false)
    setShowPriorityInput(false)
    setShowAddToInput(false)
    setShowReporterInput(false)
    setShowPointsInput(false)
  }

  const handleFileUpload = (e) => {
    const files = e.target.files
    if (!files) return
    if (files?.length > maxFilesNum)
      return setToasts(errorToast(`You can't upload more than ${maxFilesNum} files at a time.`))
    Array.from(files).forEach(file => {
      if (file.size > maxFileSize)
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

  const cancelAddComment = () => {
    setShowCommentEditor(false)
    setCommentText('')
  }

  const handleCreateComment = () => {
    if (!commentText) return setToasts(infoToast('Please enter a comment.'))
    createOrgProjectTaskCommentService(
      myOrgID,
      projectID,
      taskID,
      {
        text: commentText,
        authorID: myUserID,
      },
      setToasts,
      setAddCommentLoading
    )
      .then(() => {
        cancelAddComment()
      })
  }

  const handleDeleteTask = () => {
    const confirm = window.confirm('Are you sure you want to delete this task?')
    if (!confirm) return
    deleteProjectTaskService(tasksPath, taskID, setPageLoading, setToasts)
      .then(() => {
        resetTaskData()
      })
  }

  const moveToBacklog = () => {

  }

  const archiveTask = () => {

  }

  useEffect(() => {
    if (showCommentEditor && commentEditorRef.current)
      commentEditorRef?.current?.focus()
  }, [showCommentEditor, commentEditorRef])

  useEffect(() => {
    if (task) {
      setTaskStatus(task?.status)
      setTaskPriority(task?.priority)
      setTaskReporter(task?.reporter)
      setTaskPoints(task?.points)
      setTaskAddTo(task?.inSprint ? 'sprint' : 'backlog')
    }
  }, [task])

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
              <p>{(task.description)}</p>
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
            <div className="events-tab-header">
              <div
                className={`tab-header ${activeEventsTab === 'comments' && 'active'}`}
                onClick={() => setActiveEventsTab('comments')}
              >
                <span>Comments</span>
              </div>
              <div
                className={`tab-header ${activeEventsTab === 'events' && 'active'}`}
                onClick={() => setActiveEventsTab('events')}
              >
                <span>Events</span>
              </div>
            </div>
            {
              activeEventsTab === 'comments' &&
              <div className="comments-section events-section">
                <h5>Comments ({commentsNum})</h5>
                <div className="comments-list">
                  <div className="comment-console">
                    <Avatar
                      src={myUserImg}
                      dimensions={32}
                    />
                    {
                      !showCommentEditor ?
                        <div
                          className="fake-input"
                          placeholder="Write a comment..."
                          onClick={() => setShowCommentEditor(true)}
                        >
                          <span>Write a comment...</span>
                        </div> :
                        <div className="editor-container">
                          <WysiwygEditor
                            placeholder="Write a comment..."
                            html={commentText}
                            setHtml={setCommentText}
                            className="comment-editor"
                            ref={commentEditorRef}
                            height="100px"
                          />
                          <div className="btn-group">
                            <AppButton
                              label="Save"
                              onClick={() => handleCreateComment()}
                              rightIcon={addCommentLoading && "fas fa-spinner fa-spin"}
                            />
                            <AppButton
                              label="Cancel"
                              onClick={() => cancelAddComment()}
                              buttonType="invertedBtn"
                            />
                          </div>
                        </div>
                    }
                  </div>
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
            }
            {
              activeEventsTab === 'events' &&
              <div className="event-section events-section">
                <h5>Events ({eventsNum})</h5>
                <div className="events-list">

                </div>
                {
                  eventsNum > eventsLimit &&
                  <small
                    className="load-more"
                    onClick={() => setEventsLimit(eventsLimit + 10)}
                  >
                    Load more
                  </small>
                }
              </div>
            }
          </div>
          <div className="task-details">
            <div className="titles">
              <h5>Task Details</h5>
              <DropdownIcon
                icon="far fa-ellipsis-h"
                iconColor="var(--grayText)"
                iconSize={16}
                dimensions={28}
                showMenu={showTaskMenu}
                setShowMenu={setShowTaskMenu}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTaskMenu(prev => !prev)
                }}
                items={[
                  { label: 'Delete Task', icon: 'fas fa-trash', onClick: () => handleDeleteTask() },
                  { label: 'Move to Backlog', icon: 'fas fa-clipboard-list', onClick: () => moveToBacklog() },
                  { label: 'Move to Archive', icon: 'fas fa-archive', onClick: () => archiveTask() },
                ]}
              />
            </div>
            <div className="task-details-flex">
              <AppCoverSelect
                label="Status"
                options={columnsOptions}
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                showInput={showStatusInput}
                setShowInput={setShowStatusInput}
                cover={
                  <h5>
                    <i className="far fa-columns" />
                    {task.status}
                  </h5>
                }
              />
              <AppCoverSelect
                label="Priority"
                options={taskPriorityOptions}
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                showInput={showPriorityInput}
                setShowInput={setShowPriorityInput}
                cover={
                  <h5>
                    <span className="icons">{taskPriorityIconRender}</span>
                    {task.priority}
                  </h5>
                }
              />
              <AppCoverSelect
                label="Task Location"
                placeholder=""
                options={addToOptions}
                value={taskAddTo}
                onChange={(e) => setTaskAddTo(e.target.value)}
                showInput={showAddToInput}
                setShowInput={setShowAddToInput}
                cover={<h5>
                  <i className="far fa-tasks" />
                  {task.inSprint ? 'Current Sprint' : 'Backlog'}
                </h5>}
              />
              <AppInput
                label="Task Points"
                value={taskPoints}
                onChange={(e) => setTaskPoints(e.target.value)}
                type="number"
                max={10}
                min={0}
              />
              <OrgUsersTagInput
                label="Reporter"
                placeholder="Unassigned"
                value={taskReporter}
                onChange={(e) => setTaskReporter(e.target.value)}
                query={taskReporter}
                setLoading={() => { }}
                filters={orgAlgoliaFilters}
                addedUsers={[]}
                onUserClick={(e, user) => console.log(user)}
                onFocus={() => setShowReporterInput(true)}
                showDropdown={showReporterInput}
                setShowDropdown={setShowReporterInput}
                iconleft={<div className="icon"><i className="far fa-user" /></div>}
              />
              <div className="assignees-flex">
                <OrgUsersTagInput
                  label="Assignees"
                  placeholder="Unassigned"
                  value={assigneesQuery}
                  onChange={(e) => setAssigneesQuery(e.target.value)}
                  query={assigneesQuery}
                  setLoading={() => { }}
                  filters={orgAlgoliaFilters}
                  addedUsers={[]}
                  onUserClick={(e, user) => console.log(user)}
                  onFocus={() => setShowAssigneesInput(true)}
                  showDropdown={showAssigneesInput}
                  setShowDropdown={setShowAssigneesInput}
                  iconleft={<div className="icon"><i className="far fa-user" /></div>}
                />
                {assigneesList}
              </div>
            </div>
            <div className="meta-details-flex">
              <div>
                <h6>Created</h6>
                <span>{convertClassicDateAndTime(task.dateCreated?.toDate())}</span>
              </div>
              <div>
                <h6>Updated</h6>
                <span>{convertClassicDateAndTime(task.dateModified?.toDate())}</span>
              </div>
              <div>
                <h6>Completed On</h6>
                <span>N/A</span>
              </div>
            </div>
          </div>
          <DocViewerModal
            showModal={showDocViewer}
            setShowModal={setShowDocViewer}
            file={activeDocFile}
            portalClassName="doc-viewer-portal"
          />
          <LikesStatsModal
            showModal={showLikesModal}
            setShowModal={setShowLikesModal}
            users={likesUserIDs}
            label="Likes"
            portalClassName="likes-stats-modal"
          />
        </div>
      }
    </AppModal>
  )
}
