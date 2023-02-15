import {
  projectColumnsOptions, switchTaskPriority, switchTaskType, 
  taskPriorityOptions, taskTypeOptions
} from "app/data/projectsData"
import useUser, { useUsers } from "app/hooks/userHooks"
import { getLastColumnTaskPosition } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import FileUploader from "../ui/FileUploader"
import WysiwygEditor from "../ui/WysiwygEditor"
import OrgUsersTagInput from "./OrgUsersTagInput"
import './styles/NewTaskModal.css'

export default function NewTaskModal(props) {

  const { myOrgID } = useContext(StoreContext)
  const { showModal, setShowModal, label, onCancel, onSubmit,
    columns, taskType, setTaskType, taskTitle, setTaskTitle,
    status, setStatus, addTo, setAddTo, description, setDescription,
    files, setFiles, priority, setPriority, assigneesIDs,
    setAssigneesIDs, points, setPoints, reporter, setReporter,
    setTaskPosition, dynamicColumnID, loading } = props
  const [isDragging, setIsDragging] = useState(false)
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [reporterQuery, setTaskReporterQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [assigneesQuery, setAssigneesQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const projectID = searchParams.get('projectID')
  const reporterUser = useUser(reporter)
  const assigneesUsers = useUsers(assigneesIDs)
  const maxFileSize = 1024 * 1024 * 5
  const orgAlgoliaFilters = `activeOrgID:${myOrgID}`

  const addToOptions = [
    { label: 'Add to Sprint', value: 'sprint', icon: 'fas fa-line-columns' },
    { label: 'Add to Backlog', value: 'backlog', icon: 'fas fa-list' },
  ]

  const addReporterUser = (e, user) => {
    e.preventDefault()
    setReporter(user.userID)
  }

  const clearReporterUser = () => {
    setReporter(null)
  }

  const addAssigneeUser = (e, user) => {
    e.preventDefault()
    setAssigneesIDs(prev => [...prev, user.userID])
  }

  const removeAssigneeUser = (user) => {
    setAssigneesIDs(prev => prev.filter(id => id !== user.userID))
  }

  const clearAssignees = () => {
    setAssigneesIDs([])
  }

  const initSetStatus = (status) => {
    setStatus(status.value)
    getLastColumnTaskPosition(myOrgID, projectID, dynamicColumnID)
      .then((pos) => {
        setTaskPosition(pos)
      })
  }

  useEffect(() => {
    if (columns?.length)
      setStatus(columns[0].title)
  }, [columns])

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label={label}
      portalClassName="new-task-modal"
      onClose={onCancel}
      actions={
        <>
          <AppButton
            label="Create"
            onClick={onSubmit}
            rightIcon={loading && "far fa-spinner fa-spin"}
          />
          <AppButton
            label="Cancel"
            onClick={onCancel}
            buttonType="invertedBtn"
          />
        </>
      }
    >
      <div className="content">
        <div className="section">
          <AppReactSelect
            label="Task Type"
            placeholder={
              <div className="task-input-placeholder">
                <i
                  className={switchTaskType(taskType).icon}
                  style={{ color: switchTaskType(taskType).color }}
                />
                {taskType}
              </div>
            }
            options={taskTypeOptions}
            value={taskType}
            onChange={(type) => setTaskType(type.value)}
          />
          <br />
          <AppReactSelect
            label="Status"
            placeholder={
              <div className="task-input-placeholder">
                <i className="far fa-columns" />
                {status}
              </div>
            }
            options={projectColumnsOptions(columns)}
            value={status}
            onChange={(status) => initSetStatus(status)}
            subText="Task status represents which column in your sprint this task will be assigned to."
          />
        </div>
        <div className="section">
          <AppInput
            label="Task Title"
            placeholder="Enter a task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="full-width title-input"
          />
          <WysiwygEditor
            label="Description"
            placeholder="Enter a description..."
            html={description}
            setHtml={setDescription}
            className="full-width"
          />
          <FileUploader
            label="Attachments"
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            uploadedFiles={files}
            setUploadedFiles={setFiles}
            maxFileSize={maxFileSize}
            truncateFilenameAmpount={60}
            icon="fas fa-cloud-upload-alt"
            text="Drop files here or click to browse"
            className="full-width commonInput"
          />
        </div>
        <div className="section">
          <AppReactSelect
            label="Priority"
            placeholder={
              <div className="task-input-placeholder">
                <i
                  className={switchTaskPriority(priority).icon}
                  style={{ color: switchTaskPriority(priority).color }}
                />
                {priority}
              </div>
            }
            options={taskPriorityOptions}
            value={priority}
            onChange={(priority) => setPriority(priority.value)}
          />
          <AppReactSelect
            label="Task Location"
            placeholder={
              <div className="task-input-placeholder">
                <i className={addTo === 'sprint' ? 'far fa-line-columns' : 'far fa-list'} />
                {addTo}
              </div>
            }
            options={addToOptions}
            value={addTo}
            onChange={(location) => setAddTo(location.value)}
          />
          <AppInput
            label="Task Points"
            name="points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            type="number"
          />
          <OrgUsersTagInput
            label="Reporter"
            name="reporter"
            placeholder="Unassigned"
            value={reporterQuery}
            onChange={(e) => setTaskReporterQuery(e.target.value)}
            setLoading={setSearchLoading}
            filters={orgAlgoliaFilters}
            selectedUsers={[reporterUser]}
            onUserClick={(e, user) => addReporterUser(e, user)}
            onFocus={() => setShowCoverInput('reporter')}
            showDropdown={showCoverInput}
            setShowDropdown={setShowCoverInput}
            iconleft={<div className="icon"><i className="far fa-user" /></div>}
            onClear={() => clearReporterUser()}
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
              onUserClick={(e, user) => addAssigneeUser(e, user)}
              onUserRemove={(user) => removeAssigneeUser(user)}
              onFocus={() => setShowCoverInput('assignees')}
              showDropdown={showCoverInput}
              setShowDropdown={setShowCoverInput}
              iconleft={<div className="icon"><i className="far fa-user" /></div>}
              selectedUsers={assigneesUsers}
              multiple={assigneesIDs?.length > 1}
              maxAvatars={4}
              onClear={() => clearAssignees()}
            />
          </div>
        </div>
      </div>
    </AppModal>
  )
}
