import { projectColumnsOptions, switchTaskPriority, 
  switchTaskType, taskPriorityOptions, taskTypeOptions } from "app/data/projectsData"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useOrgProjectColumns, useOrgProjectTaskComments, 
  useOrgProjectTaskEvents, useOrgProjectTaskFiles } from "app/hooks/projectsHooks"
import useUser, { useDocsCount, useUsers } from "app/hooks/userHooks"
import { changeDiffColumnTaskPositionService, 
  createOrgProjectTaskCommentService, createOrgProjectTaskEvent, 
  deleteProjectTaskService, getLastColumnTaskPosition,
   updateSingleTaskItemService, uploadOrgProjectTaskFiles 
  } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import { areArraysEqual } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppCoverInput, AppCoverSelect } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import FileUploadBtn from "../ui/FileUploadBtn"
import LikesStatsModal from "../ui/LikesStatsModal"
import WysiwygEditor from "../ui/WysiwygEditor"
import DocViewerModal from "./DocViewerModal"
import OrgUsersTagInput from "./OrgUsersTagInput"
import TaskAttachment from "./TaskAttachment"
import TaskComment from "./TaskComment"
import TaskEvent from "./TaskEvent"
import './styles/TaskContentDetails.css'

export default function TaskContentDetails(props) {

  const { myOrgID, myUserID, myUserImg, setToasts,
    setPageLoading } = useContext(StoreContext)
  const { task, setShowModal, showDocViewer, setShowDocViewer,
    activeDocFile, setActiveDocFile, showLikesModal, 
    setShowLikesModal, likesUserIDs, setLikesUserIDs,
    showCommentEditor, setShowCommentEditor, commentText, 
    setCommentText, showCoverInput, setShowCoverInput } = props
  const [commentsLimit, setCommentsLimit] = useState(10)
  const [filesLimit, setFilesLimit] = useState(5)
  const [eventsLimit, setEventsLimit] = useState(10)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [addCommentLoading, setAddCommentLoading] = useState(false)
  const [activeEventsTab, setActiveEventsTab] = useState('comments')
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskType, setTaskType] = useState('')
  const [taskAddTo, setTaskAddTo] = useState('')
  const [taskReporter, setTaskReporter] = useState(null)
  const [taskReporterQuery, setTaskReporterQuery] = useState('')
  const [taskPoints, setTaskPoints] = useState(0)
  const [assigneesQuery, setAssigneesQuery] = useState('')
  const [showTaskMenu, setShowTaskMenu] = useState(false)
  const [showEventMenu, setShowEventMenu] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [coverInputLoading, setCoverInputLoading] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const commentEditorRef = useRef(null)
  const taskID = searchParams.get('taskID')
  const projectID = searchParams.get('projectID')
  const columns = useOrgProjectColumns(projectID)
  const comments = useOrgProjectTaskComments(projectID, taskID, commentsLimit)
  const events = useOrgProjectTaskEvents(projectID, taskID, eventsLimit)
  const attachments = useOrgProjectTaskFiles(projectID, taskID, filesLimit)
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const filesPath = `${tasksPath}/${taskID}/files`
  const eventsPath = `${tasksPath}/${taskID}/events`
  const commentsPath = `${tasksPath}/${taskID}/comments`
  const commentsNum = useDocsCount(commentsPath)
  const eventsNum = useDocsCount(eventsPath)
  const filesNum = useDocsCount(filesPath)
  const maxFileSize = 1024 * 1024 * 5
  const maxFilesNum = 5
  const orgAlgoliaFilters = `activeOrgID:${myOrgID}`
  const reporterUser = useUser(taskReporter)
  const assigneesUsers = useUsers(task?.assigneesIDs)
  const maxAssignees = 5
  console.log(comments)

  const addToOptions = [
    { label: 'Move to Sprint', value: 'sprint', isDisabled: task?.inSprint, icon: 'fas fa-line-columns' },
    { label: 'Move to Backlog', value: 'backlog', isDisabled: !task?.inSprint, icon: 'fas fa-list' },
  ]

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
      task={task}
      eventsPath={eventsPath}
      showEventMenu={showEventMenu}
      setShowEventMenu={setShowEventMenu}
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
    setShowModal && setShowModal(false)
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

  const updateSingleTaskItem = (item, eventTitle, icon, name) => {
    if (Object.values(item)[0] === task[Object.keys(item)[0]]) { // If the value is the same, don't update
      setShowCoverInput(null)
      return
    }
    setCoverInputLoading(name)
    return updateSingleTaskItemService(
      tasksPath,
      taskID,
      item,
      setToasts
    )
      .then(() => {
        setShowCoverInput(null)
        setCoverInputLoading(null)
        createOrgProjectTaskEvent(eventsPath, myUserID, eventTitle, icon, setToasts)
      })
  }

  const updateTaskColumn = (status, name) => {
    setCoverInputLoading(name)
    const newColumnName = status.value
    updateSingleTaskItem(
      { status: status.value },
      `Changed the task status from <b className="cap">${task.status}</b> to <b className="cap">${newColumnName}</b>`,
      'fas fa-columns',
      name
    )
      .then(() => {
        const newColumnID = columns?.find((column) => column.title === newColumnName)?.columnID
        const oldColumnID = task.columnID
        setShowCoverInput(null)
        getLastColumnTaskPosition(myOrgID, projectID, oldColumnID)
          .then((position) => {
            changeDiffColumnTaskPositionService(
              myOrgID,
              projectID,
              task,
              (+position + 1),
              oldColumnID,
              newColumnID,
              columns,
              setToasts
            )
              .then(() => {
                setCoverInputLoading(null)
                setToasts(successToast('Task status updated successfully.'))
              })
          })
      })
  }

  const moveToBacklog = () => {
    updateSingleTaskItem(
      {
        inSprint: false,
        sprintID: null,
        columnID: null,
        position: null,
        status: 'backlog'
      },
      'Moved the task to the backlog',
      'fas fa-tasks',
      'addTo'
    )
      .then(() => {
        setCoverInputLoading(null)
        setToasts(successToast('Task moved to the backlog.'))
        setShowModal && setShowModal(false)
      })
  }

  const archiveTask = () => {

  }

  const updateTaskLocation = (location, name) => {
    setCoverInputLoading(name)
    const newLocationName = location.value
    if (newLocationName === 'backlog') {
      moveToBacklog()
    }
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
      setTaskType(task?.taskType)
      setTaskReporter(task?.reporter)
      setTaskPoints(task?.points)
      setTaskAddTo(task?.inSprint ? 'sprint' : 'backlog')
    }
  }, [task])

  return task && (
    <div className="view-task-content">
      <div className="task-content">
        <AppCoverInput
          name="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onCheck={() => updateSingleTaskItem(
            { title: taskName },
            `Changed task name to <b>${taskName}</b>`,
            'fas fa-edit',
            'taskName'
          )}
          onCancel={() => setShowCoverInput(null)}
          showInput={showCoverInput}
          setShowInput={setShowCoverInput}
          cover={<h3>{taskName}</h3>}
          className="task-name"
          linkEnterPressToOnCheck
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
              onSave={() => updateSingleTaskItem(
                { description: taskDescription },
                `Changed task description`,
                'fas fa-edit',
                'description'
              )}
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
            <span><i className="fas fa-comment" /> Comments</span>
          </div>
          <div
            className={`tab-header ${activeEventsTab === 'events' && 'active'}`}
            onClick={() => setActiveEventsTab('events')}
          >
            <span><i className="fas fa-stream" /> Events</span>
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
              { label: 'Archive Task', icon: 'fas fa-archive', onClick: () => archiveTask() },
            ]}
          />
        </div>
        <div className="task-details-flex">
          <AppCoverSelect
            label="Status"
            name="status"
            options={projectColumnsOptions(columns)}
            value={taskStatus}
            onChange={(status) => updateTaskColumn(status)}
            showInput={showCoverInput}
            setShowInput={setShowCoverInput}
            loading={coverInputLoading === 'status'}
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
            onChange={(priority) => updateSingleTaskItem(
              { priority: priority.value },
              `Changed the task priority from <b>${task.priority}</b> to <b>${priority.value}</b>`,
              'fas fa-bars',
              'priority'
            )}
            showInput={showCoverInput}
            setShowInput={setShowCoverInput}
            loading={coverInputLoading === 'priority'}
            cover={
              <h5>
                <i
                  className={switchTaskPriority(taskPriority)?.icon}
                  style={{ color: switchTaskPriority(taskPriority)?.color }}
                />
                {task.priority}
              </h5>
            }
          />
          <AppCoverSelect
            label="Task Type"
            name="taskType"
            options={taskTypeOptions}
            value={taskType}
            onChange={(type) => updateSingleTaskItem(
              { taskType: type.value },
              `Changed the task type from <b>${task.taskType}</b> to <b>${type.value}</b>`,
              'fas fa-chevron-up',
              'priority'
            )}
            showInput={showCoverInput}
            setShowInput={setShowCoverInput}
            loading={coverInputLoading === 'taskType'}
            cover={
              <h5>
                <i
                  className={switchTaskType(task?.taskType).icon}
                  style={{ color: switchTaskType(task?.taskType).color }}
                />
                {task.taskType}
              </h5>
            }
          />
          <AppCoverSelect
            label="Task Location"
            placeholder=""
            name="addTo"
            options={addToOptions}
            value={taskAddTo}
            onChange={(location) => updateTaskLocation(location)}
            showInput={showCoverInput}
            setShowInput={setShowCoverInput}
            loading={coverInputLoading === 'addTo'}
            cover={<h5>
              <i className={task.inSprint ? 'fas fa-line-columns' : 'fas fa-list'} />
              {task.inSprint ? 'Current Sprint' : 'Backlog'}
            </h5>}
          />
          <AppCoverInput
            label="Task Points"
            name="points"
            value={taskPoints}
            onChange={(e) => setTaskPoints(e.target.value)}
            type="number"
            showInput={showCoverInput}
            setShowInput={setShowCoverInput}
            loading={coverInputLoading === 'points'}
            onCheck={() => updateSingleTaskItem(
              { points: +taskPoints },
              `Changed the task points from <b>${task.points}</b> to <b>${taskPoints}</b>`,
              'fas fa-gamepad',
              'points'
            )}
            onCancel={() => setShowCoverInput(null)}
            cover={<h5>
              <i className="far fa-gamepad" />
              {taskPoints}
            </h5>}
            linkEnterPressToOnCheck
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
            onUserClick={(e, user) => {
              e.preventDefault()
              updateSingleTaskItem(
                { reporter: user.userID },
                `Set <b>${user.firstName} ${user.lastName}</b> as the reporter for this task`,
                'fas fa-bullhorn',
                'reporter'
              )
            }}
            onFocus={() => setShowCoverInput('reporter')}
            showDropdown={showCoverInput}
            setShowDropdown={setShowCoverInput}
            iconleft={<div className="icon"><i className="far fa-user" /></div>}
            onClear={() => updateSingleTaskItem(
              { reporter: null },
              `Removed ${reporterUser?.firstName} ${reporterUser?.lastName} as the reporter for this task`,
              'fas fa-bullhorn',
              'reporter'
            )}
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
              onUserClick={(e, user) => {
                e.preventDefault()
                updateSingleTaskItem(
                  { assigneesIDs: [...task?.assigneesIDs, user.userID] },
                  `Assigned <b>${user.firstName} ${user.lastName}</b> to this task`,
                  'fas fa-user-plus',
                  'assignees'
                )
              }}
              onUserRemove={(user) => updateSingleTaskItem(
                { assigneesIDs: task?.assigneesIDs?.filter((assignee) => assignee !== user.userID) },
                `Removed <b>${user.firstName} ${user.lastName}</b> from this task`,
                'fas fa-user-minus',
                'assignees'
              )}
              onFocus={() => setShowCoverInput('assignees')}
              showDropdown={showCoverInput}
              setShowDropdown={setShowCoverInput}
              iconleft={<div className="icon"><i className="far fa-user" /></div>}
              selectedUsers={assigneesUsers}
              multiple={task.assigneesIDs.length > 1}
              maxAvatars={4}
              onClear={() => updateSingleTaskItem(
                { assigneesIDs: [] },
                `Removed all assignees from this task`,
                'fas fa-user-minus',
                'assignees'
              )}
              inputSubtitle={
                !areArraysEqual(task.assigneesIDs, [myUserID]) &&
                <small
                  className="assign-to-me"
                  onClick={() => {
                    updateSingleTaskItem(
                      { assigneesIDs: [myUserID] },
                      `Assigned themselves to this task`,
                      'fas fa-user-plus',
                      'assignees'
                    )
                  }}>
                  Assign to Me
                </small>
              }
            />
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
  )
}
