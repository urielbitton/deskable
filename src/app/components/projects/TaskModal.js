import {
  switchTaskPriority, switchTaskType,
  taskPriorityOptions
} from "app/data/projectsData"
import {
  useOrgProjectColumns,
  useOrgProjectTask, useOrgProjectTaskComments,
  useOrgProjectTaskEvents,
  useOrgProjectTaskFiles
} from "app/hooks/projectsHooks"
import useUser, { useDocsCount, useUsers } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppModal from "../ui/AppModal"
import FileUploadBtn from "../ui/FileUploadBtn"
import './styles/TaskModal.css'
import TaskComment from "./TaskComment"
import TaskAttachment from "./TaskAttachment"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import {
  createOrgProjectTaskCommentService,
  createOrgProjectTaskEvent,
  deleteProjectTaskService,
  updateSingleTaskItemService,
  uploadOrgProjectTaskFiles
} from "app/services/projectsServices"
import DocViewerModal from "./DocViewerModal"
import LikesStatsModal from "../ui/LikesStatsModal"
import Avatar from "../ui/Avatar"
import WysiwygEditor from "../ui/WysiwygEditor"
import AppButton from "../ui/AppButton"
import { AppCoverInput, AppCoverSelect } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import OrgUsersTagInput from "./OrgUsersTagInput"
import TaskEvent from "./TaskEvent"

export default function TaskModal(props) {

  const { myOrgID, myUserID, myUserImg, myUserName,
    setToasts, setPageLoading } = useContext(StoreContext)
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
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskAddTo, setTaskAddTo] = useState('')
  const [taskReporter, setTaskReporter] = useState(null)
  const [taskReporterQuery, setTaskReporterQuery] = useState('')
  const [taskPoints, setTaskPoints] = useState(0)
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [assigneesQuery, setAssigneesQuery] = useState('')
  const [showTaskMenu, setShowTaskMenu] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const commentEditorRef = useRef(null)
  const taskID = searchParams.get('taskID')
  const projectID = searchParams.get('projectID')
  const task = useOrgProjectTask(projectID, taskID)
  const columns = useOrgProjectColumns(projectID)
  const comments = useOrgProjectTaskComments(projectID, taskID, commentsLimit)
  const events = useOrgProjectTaskEvents(projectID, taskID, eventsLimit)
  const attachments = useOrgProjectTaskFiles(projectID, taskID, filesLimit)
  const filesPath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/files`
  const eventsPath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/events`
  const commentsPath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/comments`
  const commentsNum = useDocsCount(commentsPath)
  const eventsNum = useDocsCount(eventsPath)
  const filesNum = useDocsCount(filesPath)
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const maxFileSize = 1024 * 1024 * 5
  const maxFilesNum = 5
  const orgAlgoliaFilters = `activeOrgID:${myOrgID}`
  const reporterUser = useUser(taskReporter)
  const assigneesUsers = useUsers(task?.assigneesIDs)
  const maxAssignees = 5

  const columnsOptions = columns?.map((column) => {
    return {
      label: column.title,
      value: column.title,
    }
  })

  const addToOptions = [
    { label: 'Move to Sprint', value: 'sprint', disabled: task?.inSprint },
    { label: 'Move to Backlog', value: 'backlog', disabled: !task?.inSprint },
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

  const eventsList = events?.map((event, index) => {
    return <TaskEvent
      key={index}
      event={event}
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
    setShowCoverInput(null)
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
      filesPath,
      Array.from(files),
      filesPath,
      setUploadLoading,
      setToasts
    )
      .then(() => {
        const eventTitle = `Uploaded ${files?.length} file${files?.length > 1 ? 's' : ''}`
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, 'fas fa-photo-video', setToasts)
      })
  }

  const cancelAddComment = () => {
    setShowCommentEditor(false)
    setCommentText('')
  }

  const handleCreateComment = () => {
    if (!commentText) return setToasts(infoToast('Please enter a comment.'))
    createOrgProjectTaskCommentService(
      commentsPath,
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

  // Update single task details fields functions

  const updateTaskName = (e) => {
    updateSingleTaskItemService(
      tasksPath,
      taskID,
      {
        title: taskName,
      },
      setToasts
    )
      .then(() => {
        const eventTitle = `Changed task name to <b>${taskName}</b>`
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, 'fas fa-edit', setToasts)
        setShowCoverInput(null)
      })
  }
  
  const updateTaskDescription = () => {
    updateSingleTaskItemService(
      tasksPath,
      taskID,
      {
        description: taskDescription,
      },
      setToasts
    )
      .then(() => {
        const eventTitle = `Changed the task description`
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, 'fas fa-edit', setToasts)
        setShowCoverInput(null)
      })
  }

  const updateReporter = (e, user) => {
    e.preventDefault()
    updateSingleTaskItemService(
      tasksPath,
      taskID,
      {
        reporter: user.userID,
      },
      setToasts
    )
      .then(() => {
        const eventTitle = `Set <a href="/organization/profile/${user?.userID}">${user?.firstName} ${user?.lastName}</a> as the reporter for this task.`
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, 'fas fa-bullhorn', setToasts)
        setShowCoverInput(null)
      })
  }

  const addAssignee = (e, user) => {
    e.preventDefault()
    updateSingleTaskItemService(
      tasksPath,
      taskID,
      {
        assigneesIDs: [...task?.assigneesIDs, user.userID],
      },
      setToasts
    )
      .then(() => {
        setShowCoverInput(null)
        const eventTitle = `Assigned <a href="/organization/profile/${user?.userID}">${user?.firstName} ${user?.lastName}</a to this task.`
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, 'fas fa-user-plus', setToasts)
      })
  }

  const removeAssignee = (user) => {
    updateSingleTaskItemService(
      tasksPath,
      taskID,
      {
        assigneesIDs: task?.assigneesIDs?.filter((assignee) => assignee !== user.userID),
      },
      setToasts
    )
      .then(() => {
        setToasts(successToast('User unassigned from this task.'))
        const eventTitle = `Removed <a href="/organization/profile/${user?.userID}">${user?.firstName} ${user?.lastName}</a> from this task.`
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, 'fas fa-user-minus', setToasts)
      })
  }

  useEffect(() => {
    if (showCommentEditor && commentEditorRef.current)
      commentEditorRef?.current?.focus()
  }, [showCommentEditor, commentEditorRef])

  useEffect(() => {
    if (task) {
      setTaskName(task?.title)
      setTaskDescription(task?.description)
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
            <AppCoverInput
              name="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onCheck={() => updateTaskName()}
              onCancel={() => setShowCoverInput(null)}
              showInput={showCoverInput}
              setShowInput={setShowCoverInput}
              cover={<h3>{taskName}</h3>}
              className="task-name"
            />
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
              <div className="appCoverInput description">
                <WysiwygEditor
                  html={taskDescription}
                  setHtml={setTaskDescription}
                  height="200px"
                  containerStyles={{ display: showCoverInput === 'description' ? 'block' : 'none' }}
                  enableEditing
                  onSave={() => updateTaskDescription()}
                  onCancel={() => setShowCoverInput(null)}
                />
                <div
                  className="coverInput"
                  onClick={() => setShowCoverInput('description')}
                  style={{ display: showCoverInput === 'description' ? 'none' : 'block' }}
                >
                  <p dangerouslySetInnerHTML={{ __html: task.description }} />
                </div>
              </div>
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
                  {eventsList}
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
                name="status"
                options={columnsOptions}
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
                cover={
                  <h5>
                    <i className="far fa-columns" />
                    {task.status}
                  </h5>
                }
              />
              <AppCoverSelect
                label="Priority"
                name="priority"
                options={taskPriorityOptions}
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
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
                name="addTo"
                options={addToOptions}
                value={taskAddTo}
                onChange={(e) => setTaskAddTo(e.target.value)}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
                cover={<h5>
                  <i className="far fa-tasks" />
                  {task.inSprint ? 'Current Sprint' : 'Backlog'}
                </h5>}
              />
              <AppCoverInput
                label="Task Points"
                name="points"
                value={taskPoints}
                onChange={(e) => setTaskPoints(e.target.value)}
                type="number"
                max={10}
                min={0}
                showInput={showCoverInput}
                setShowInput={setShowCoverInput}
                cover={<h5>
                  <i className="far fa-gamepad" />
                  {taskPoints}
                </h5>}
              />
              <OrgUsersTagInput
                label="Reporter"
                name="reporter"
                placeholder="Unassigned"
                value={taskReporterQuery}
                onChange={(e) => setTaskReporterQuery(e.target.value)}
                setLoading={setSearchLoading}
                filters={orgAlgoliaFilters}
                selectedUsers={[reporterUser]}
                onUserClick={(e, user) => updateReporter(e, user)}
                onFocus={() => setShowCoverInput('reporter')}
                showDropdown={showCoverInput}
                setShowDropdown={setShowCoverInput}
                iconleft={<div className="icon"><i className="far fa-user" /></div>}
              />
              <div className="assignees-flex">
                <OrgUsersTagInput
                  label="Assignees"
                  name="assignees"
                  placeholder="Unassigned"
                  value={assigneesQuery}
                  onChange={(e) => setAssigneesQuery(e.target.value)}
                  setLoading={setSearchLoading}
                  filters={orgAlgoliaFilters}
                  onUserClick={(e, user) => addAssignee(e, user)}
                  onUserRemove={(user) => removeAssignee(user)}
                  onFocus={() => setShowCoverInput('assignees')}
                  showDropdown={showCoverInput}
                  setShowDropdown={setShowCoverInput}
                  iconleft={<div className="icon"><i className="far fa-user" /></div>}
                  selectedUsers={assigneesUsers}
                  multiple={task.assigneesIDs.length > 1}
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
    </AppModal >
  )
}
