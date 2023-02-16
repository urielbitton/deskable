import { taskTypeOptions } from "app/data/projectsData"
import { infoToast } from "app/data/toastsTemplates"
import { useBuildProjectBoard, useOrgProjectColumns } from "app/hooks/projectsHooks"
import { getDocsCount } from "app/services/CrudDB"
import {
  changeSameColumnTaskPositionService,
  changeDiffColumnTaskPositionService,
  createProjectTaskService, deleteProjectColumnService,
  getLastColumnTaskPosition, renameBoardColumnService,
  deleteProjectTaskService
} from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from "react-router-dom"
import KanbanBoard from "./KanbanBoard"
import NewTaskModal from "./NewTaskModal"
import TaskModal from "./TaskModal"

export default function ProjectBoard({ project, tasksFilter }) {

  const { myOrgID, myUserID, setToasts, setPageLoading } = useContext(StoreContext)
  const projectID = useParams().projectID
  const board = useBuildProjectBoard(projectID, tasksFilter)
  const columns = useOrgProjectColumns(projectID)
  const [searchParams, setSearchParams] = useSearchParams()
  const viewModalMode = searchParams.get('viewModal') === 'true'
  const newTaskModalMode = searchParams.get('newTask') === 'true'
  const [editTitleMode, setEditTitleMode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [viewTaskModal, setViewTaskModal] = useState(false)
  const [taskType, setTaskType] = useState(taskTypeOptions[0].value)
  const [taskTitle, setTaskTitle] = useState('')
  const [status, setStatus] = useState(columns[0]?.title)
  const [addTo, setAddTo] = useState('sprint')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [priority, setPriority] = useState('medium')
  const [assigneesIDs, setAssigneesIDs] = useState([])
  const [points, setPoints] = useState(0)
  const [reporter, setReporter] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [taskNum, setTaskNum] = useState(0)
  const dynamicColumnID = columns?.find(column => column.title === status)?.columnID
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

  const preAddTask = (columnID) => {
    return getDocsCount(tasksPath)
      .then((num) => {
        const taskNum = +num + 1
        setTaskNum(taskNum)
        return getLastColumnTaskPosition(myOrgID, projectID, columnID)
          .then((pos) => {
            setTaskTitle(`${project.name.slice(0, 3).toUpperCase()}-${taskNum < 10 ? '0' : ''}${taskNum}`)
            setStatus(columns?.find(column => column.columnID === columnID)?.title)
            return (+pos+1)
          })
      })
      .catch(err => console.log(err))
  }

  const initAddTask = (columnID) => {
    setSearchParams({ newTask: 'true' })
    setShowNewTaskModal(true)
    preAddTask(columnID)
  }

  const resetNewTaskModal = () => {
    setTaskTitle('')
    setTaskType(taskTypeOptions[0].value)
    setStatus(columns[0]?.title)
    setAddTo('sprint')
    setDescription('')
    setFiles([])
    setPriority('medium')
    setAssigneesIDs([])
    setPoints(0)
    setReporter(null)
    setTaskNum(0)
    setShowNewTaskModal(false)
    setSearchParams('')
  }

  const addTask = () => {
    if (!allowAddTask) return setToasts(infoToast('Please fill in all required fields.'))
    preAddTask(dynamicColumnID)
      .then((position) => {
        return createProjectTaskService(
          myOrgID,
          myUserID,
          project,
          dynamicColumnID,
          {
            assigneesIDs,
            addTo,
            description,
            position,
            priority,
            status,
            taskType,
            taskTitle,
            points,
            reporter
          },
          taskNum,
          files?.map(file => file.file),
          setLoading,
          setToasts
        )
      })
      .then(() => {
        resetNewTaskModal()
      })
      .catch(err => console.log(err))
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
    if (from.fromColumnId === to.toColumnId) {
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
    if (viewModalMode) {
      setViewTaskModal(true)
    }
    if (newTaskModalMode) {
      setShowNewTaskModal(true)
    }
  }, [])

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
