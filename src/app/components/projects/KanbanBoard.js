import React from 'react'
import Board from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'
import './styles/KanbanBoard.css'
import BoardColumn from "./BoardColumn"
import BoardCard from "./BoardCard"

export default function KanbanBoard(props) {

  const { board, removeColumn, renameColumn, initAddTask,
    editTitleMode, setEditTitleMode } = props

  return (
    <Board
      renderColumnHeader={(column) => (
        <BoardColumn
          title={column.title}
          renameColumn={renameColumn}
          removeColumn={removeColumn}
          initAddTask={initAddTask}
          columnID={column.columnID}
          editTitleMode={editTitleMode}
          setEditTitleMode={setEditTitleMode}
        />
      )}
      renderCard={(task, {dragging}) => (
        <BoardCard 
          dragging={dragging}
          task={task}
        />
      )}
    >
      {board}
    </Board>
  )
}


