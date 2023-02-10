import { taskPriorityOptions, taskTypeOptions } from "app/data/projectsData"
import React, { useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppSelect } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import FileUploader from "../ui/FileUploader"
import WysiwygEditor from "../ui/WysiwygEditor"
import './styles/NewTaskModal.css'

export default function NewTaskModal(props) {

  const { showModal, setShowModal, label, onCancel, onSubmit,
    columns, taskType, setTaskType, taskTitle, setTaskTitle,
    status, setStatus, addTo, setAddTo, description, setDescription,
    files, setFiles, priority, setPriority, assigneesIDs, 
    setAssigneesIDs, points, setPoints, reporter, setReporter,
    loading } = props
  const [isDragging, setIsDragging] = useState(false)
  const maxFileSize = 1024 * 1024 * 5

  const columnsOptions = columns?.map((column) => {
    return {
      label: column.title,
      value: column.title,
    }
  })

  const addToOptions = [
    { label: 'Add to Sprint', value: 'sprint' },
    { label: 'Add to Backlog', value: 'backlog' },
  ]

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label={label}
      portalClassName="new-task-modal"
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
          <AppSelect
            label="Task Type"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            options={taskTypeOptions}
          />
          <br />
          <AppSelect
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={columnsOptions}
            button={
              <small className="inputSubtext">Task status represents which column in your sprint this task will be assigned to.</small>
            }
          />
        </div>
        <div className="section">
          <AppInput
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="full-width"
          />
          <WysiwygEditor
            label="Description"
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
            icon="fas fa-cloud-upload-alt"
            text="Drop files here or click to browse"
            className="full-width commonInput"
          />
        </div>
        <div className="section">
          <AppInput
            label="Assignees"
          />
          <AppInput
            label="Reporter"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
          />
          <AppSelect
            label="Add To Sprint/Backlog"
            value={addTo}
            onChange={(e) => setAddTo(e.target.value)}
            options={addToOptions}
          />
          <AppSelect
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={taskPriorityOptions}
          />
          <AppInput
            label="Points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
      </div>
    </AppModal>
  )
}
