import { taskTypeOptions } from "app/data/projectsData"
import { infoToast } from "app/data/toastsTemplates"
import { useBuildProjectBoard, useOrgProjectColumns } from "app/hooks/projectsHooks"
import { createProjectTaskService, deleteProjectColumnService, 
  getLastProjectTaskNumber, renameBoardColumnService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import KanbanBoard from "./KanbanBoard"
import NewTaskModal from "./NewTaskModal"
import TaskModal from "./TaskModal"

export default function ProjectBoard({project}) {

  const { myOrgID, myUserID, setToasts, setPageLoading } = useContext(StoreContext)
  const projectID = useParams().projectID
  const board = useBuildProjectBoard(projectID)
  const columns = useOrgProjectColumns(projectID)
  const [editTitleMode, setEditTitleMode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [viewTaskModal, setViewTaskModal] = useState(false)
  const [newColumnID, setNewColumnID] = useState(null)
  const [taskType, setTaskType] = useState(taskTypeOptions[0].value)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskNumber, setTaskNumber] = useState(0)
  const [status, setStatus] = useState(columns[0]?.title)
  const [addTo, setAddTo] = useState('sprint')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [priority, setPriority] = useState('medium')
  const [assigneesIDs, setAssigneesIDs] = useState([])
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`

  const allowAddTask = taskTitle?.length > 0

  const removeColumn = (columnID) => {
    const confirm = window.confirm('Are you sure you want to delete this column?')
    if (!confirm) return setToasts(infoToast('Column deletion cancelled.'))
    setPageLoading(true)
    deleteProjectColumnService(
      myOrgID, 
      projectID, 
      columnID, 
      setPageLoading, 
      setToasts
    )
  }

  const renameColumn = (columnID, title) => {
    renameBoardColumnService(
      myOrgID,
      projectID, 
      columnID, 
      title, 
      setToasts
    )
    .then(() => {
      setEditTitleMode(null)
    })
  }

  const initAddTask = (columnID) => {
    getLastProjectTaskNumber(myOrgID, projectID)
    .then((number) => {
      setTaskNumber(+number+1)
      setTaskTitle(`${project.name.slice(0, 3).toUpperCase()}-${(+number+1) < 10 && '0'}${+number+1}`)
      setNewColumnID(columnID)
      setShowNewTaskModal(true)
      setStatus(columns?.find(column => column.columnID === columnID)?.title)
    })
  }

  const resetNewTaskModal = () => {
    setNewColumnID(null)
    setTaskTitle(null)
    setShowNewTaskModal(false)
  }

  const addTask = () => {
    if(!allowAddTask) return setToasts(infoToast('Please fill in all required fields.'))
    createProjectTaskService(
      myOrgID, 
      myUserID, 
      project, 
      newColumnID,
      {
        assigneesIDs,
        description,
        taskNumber,
        priority,
        status,
        taskType,
        taskTitle,
      }, 
      files,
      setLoading, 
      setToasts
    )
    .then(() => {
      resetNewTaskModal()
    })
  }

  const onCardDragEnd = (card, from, to) => {
    console.log(card, from, to)
  }

  return (
    <div className="kanban-board-container">
      <KanbanBoard
        board={board}
        removeColumn={removeColumn}
        renameColumn={renameColumn}
        initAddTask={initAddTask}
        onCardDragEnd={onCardDragEnd}
        editTitleMode={editTitleMode}
        setEditTitleMode={setEditTitleMode}
        tasksPath={tasksPath}
      />
      <NewTaskModal
        showModal={showNewTaskModal}
        setShowModal={setShowNewTaskModal}
        label="Create Task"
        onSubmit={addTask}
        onCancel={() => resetNewTaskModal()}
        columns={columns}
        taskType={taskType}
        setTaskType={setTaskType}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        status={status}
        setStatus={setStatus}
        addTo={addTo}
        setAddTo={setAddTo}
        description={description}
        setDescription={setDescription}
        files={files}
        setFiles={setFiles}
        priority={priority}
        setPriority={setPriority}
        assigneesIDs={assigneesIDs}
        setAssigneesIDs={setAssigneesIDs}
        loading={loading}
      />
      <TaskModal
        showModal={viewTaskModal}
        setShowModal={setViewTaskModal}
        label="Task Details"
      />
    </div>
  )
}
