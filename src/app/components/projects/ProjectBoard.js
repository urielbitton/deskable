import { taskTypeOptions } from "app/data/projectsData"
import { infoToast } from "app/data/toastsTemplates"
import { useBuildProjectBoard, useOrgProjectColumns } from "app/hooks/projectsHooks"
import { getDocsCount } from "app/services/CrudDB"
import { changeSameColumnTaskPositionService, 
  changeDiffColumnTaskPositionService,
  createProjectTaskService, deleteProjectColumnService, 
  getLastColumnTaskPosition, renameBoardColumnService, 
  deleteProjectTaskService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from "react-router-dom"
import KanbanBoard from "./KanbanBoard"
import NewTaskModal from "./NewTaskModal"
import TaskModal from "./TaskModal"

export default function ProjectBoard({project}) {

  const { myOrgID, myUserID, setToasts, setPageLoading } = useContext(StoreContext)
  const projectID = useParams().projectID
  const board = useBuildProjectBoard(projectID)
  const columns = useOrgProjectColumns(projectID)
  const [searchParams, setSearchParams] = useSearchParams()
  const [editTitleMode, setEditTitleMode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [viewTaskModal, setViewTaskModal] = useState(false)
  const [newColumnID, setNewColumnID] = useState(null)
  const [taskType, setTaskType] = useState(taskTypeOptions[0].value)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskPosition, setTaskPosition] = useState(0)
  const [status, setStatus] = useState(columns[0]?.title)
  const [addTo, setAddTo] = useState('sprint')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [priority, setPriority] = useState('medium')
  const [assigneesIDs, setAssigneesIDs] = useState([])
  const [points, setPoints] = useState(null)
  const [reporter, setReporter] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const tasksPath = `organizations/${myOrgID}/projects/${projectID}/tasks`
  const columnsPath = `organizations/${myOrgID}/projects/${projectID}/columns`

  const allowAddTask = taskTitle?.length > 0

  const removeColumn = (columnID) => {
    const confirm = window.confirm('Are you sure you want to delete this column?')
    if (!confirm) return setToasts(infoToast('Column deletion cancelled.'))
    setPageLoading(true)
    deleteProjectColumnService(
      columnsPath,
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
    const taskNum = +getDocsCount(tasksPath) + 1
    getLastColumnTaskPosition(myOrgID, projectID, columnID)
    .then((pos) => {
      setTaskPosition(pos+1)
      setTaskTitle(`${project.name.slice(0, 3).toUpperCase()}-${(pos+1) < 10 && '0'}${pos+1}`)
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
    const taskNum = +getDocsCount(tasksPath) + 1
    createProjectTaskService(
      myOrgID, 
      myUserID, 
      project, 
      newColumnID,
      {
        assigneesIDs,
        addTo,
        description,
        taskPosition,
        priority,
        status,
        taskType,
        taskTitle,
        points,
        reporter
      }, 
      taskNum,
      files,
      setLoading, 
      setToasts
    )
    .then(() => {
      resetNewTaskModal()
    })
  }

  const handleDeleteTask = (taskID) => {
    const confirm = window.confirm('Are you sure you want to delete this task?')
    if (!confirm) return 
    deleteProjectTaskService(tasksPath, taskID, setLoading, setToasts)
  }

  const handleOpenTask = (taskID) => {
    setSearchParams(`?projectID=${projectID}&taskID=${taskID}&viewModal=true`)
    setViewTaskModal(true)
  }

  const onCardDragEnd = (task, from, to) => {
    if(from.fromColumnId === to.toColumnId) {
      changeSameColumnTaskPositionService(
        myOrgID, 
        projectID, 
        task, 
        to.toPosition, 
        setLoading, 
        setToasts
      ) 
    }
    else {
      changeDiffColumnTaskPositionService(
        myOrgID, 
        projectID, 
        task, 
        to.toPosition, 
        from.fromColumnId, 
        to.toColumnId, 
        columns,
        setLoading, 
        setToasts
      )
    }
  }

  useEffect(() => {
    if(searchParams.get('viewModal') === 'true') {
      setViewTaskModal(true)
    }
  },[])

  return (
    <div className={`kanban-board-container ${isDragging ? 'is-dragging' : ''}`}>
      <KanbanBoard
        board={board}
        removeColumn={removeColumn}
        renameColumn={renameColumn}
        initAddTask={initAddTask}
        handleDeleteTask={handleDeleteTask}
        handleOpenTask={handleOpenTask}
        onCardDragEnd={onCardDragEnd}
        editTitleMode={editTitleMode}
        setEditTitleMode={setEditTitleMode}
        tasksPath={tasksPath}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
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
        points={points}
        setPoints={setPoints}
        reporter={reporter}
        setReporter={setReporter}
        loading={loading}
      />
      <TaskModal
        showModal={viewTaskModal}
        setShowModal={setViewTaskModal}
      />
    </div>
  )
}
