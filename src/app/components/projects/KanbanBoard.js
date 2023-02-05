import React from 'react'
import Board from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'
import './styles/KanbanBoard.css'
import BoardColumn from "./BoardColumn"
import BoardCard from "./BoardCard"

export default function KanbanBoard(props) {

  const { board, removeColumn, renameColumn, initAddTask,
    editTitleMode, setEditTitleMode, tasksPath } = props

  return (
    <Board
      renderColumnHeader={(column) => (
        <BoardColumn
          title={column.title}
          renameColumn={renameColumn}
          removeColumn={removeColumn}
          initAddTask={initAddTask}
          columnID={column.id}
          tasksNum={column.tasksNum}
          editTitleMode={editTitleMode}
          setEditTitleMode={setEditTitleMode}
        />
      )}
      disableColumnDrag
      renderCard={(task, {dragging}) => (
        <BoardCard 
          dragging={dragging}
          task={task}
          tasksPath={tasksPath}
        />
      )}
    >
      {board}
    </Board>
  )
}


