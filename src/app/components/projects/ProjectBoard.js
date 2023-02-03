import { infoToast } from "app/data/toastsTemplates"
import { useBuildProjectBoard } from "app/hooks/projectsHooks"
import { createProjectTaskService, deleteProjectColumnService, renameBoardColumnService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import AppModal from "../ui/AppModal"
import KanbanBoard from "./KanbanBoard"

export default function ProjectBoard({project}) {

  const { myOrgID, myUserID, setToasts, setPageLoading } = useContext(StoreContext)
  const projectID = useParams().projectID
  const board = useBuildProjectBoard(projectID)
  const [editTitleMode, setEditTitleMode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

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

  const addTask = (columnID, title) => {
    createProjectTaskService(
      myOrgID, 
      myUserID, 
      project, 
      {
        columnID,
        title,
      }, 
      {
        //entire task object from new task modal 
      }, 
      setLoading, setToasts)
  }

  return (
    <div className="kanban-board-container">
      <KanbanBoard
        board={board}
        removeColumn={removeColumn}
        renameColumn={renameColumn}
        addTask={addTask}
        editTitleMode={editTitleMode}
        setEditTitleMode={setEditTitleMode}
      />
      <AppModal
        showModal={showNewTaskModal}
        setShowModal={setShowNewTaskModal}
        label="New Task"
      >
        {/* New task modal */}
      </AppModal>
    </div>
  )
}
