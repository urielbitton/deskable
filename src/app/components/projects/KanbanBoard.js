import React, { useState } from 'react'
import Board from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'
import './styles/KanbanBoard.css'
import DropdownIcon from "../ui/DropDownIcon"
import { AppInput } from "../ui/AppInputs"

export default function KanbanBoard(props) {

  const { board, removeColumn, renameColumn, addTask,
    editTitleMode, setEditTitleMode } = props

  return (
    <Board
      renderColumnHeader={({ title, id }) => (
        <ColumnHeader
          title={title}
          renameColumn={renameColumn}
          removeColumn={removeColumn}
          addTask={addTask}
          columnID={id}
          editTitleMode={editTitleMode}
          setEditTitleMode={setEditTitleMode}
        />
      )}
    >
      {board}
    </Board>
  )
}


export function ColumnHeader(props) {

  const { title, columnID, renameColumn, removeColumn, addTask,
    editTitleMode, setEditTitleMode } = props
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const notColumnEditing = editTitleMode !== columnID

  const initRenameColumn = () => {
    if (notColumnEditing) {
      setEditTitleMode(columnID)
      setEditTitle(title)
    }
    else {
      setEditTitleMode(null)
    }
  }

  const saveHeaderTitle = () => {
    renameColumn(columnID, editTitle)
  }

  const deleteColumn = () => {
    removeColumn(columnID)
  }

  const addColumnTask = () => {
    addTask(columnID, title)
  }

  return (
    <div className="board-column-header">
      <div className="top">
        {
          editTitleMode !== columnID ?
            <h5>{title}</h5> :
            <AppInput
              placeholder="Column title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveHeaderTitle()}
              iconright={
                <i
                  className="far fa-check"
                  onClick={() => saveHeaderTitle()}
                />
              }
            />
        }
        <DropdownIcon
          icon="far fa-ellipsis-h"
          iconSize="16px"
          iconColor="var(--grayText)"
          dimensions={24}
          showMenu={showHeaderMenu}
          setShowMenu={setShowHeaderMenu}
          onClick={() => setShowHeaderMenu(prev => !prev)}
          items={[
            { 
              label: notColumnEditing ? 'Rename' : 'Cancel Rename',
              onClick: initRenameColumn, 
              icon: notColumnEditing ? 'fas fa-pen' : 'far fa-times' 
            },
            { label: 'Remove', onClick: () => deleteColumn, icon: 'fas fa-trash' }
          ]}
        />
      </div>
      <div
        className="add-card-bar"
        onClick={addColumnTask}
      >
        <i className="fal fa-plus" />
      </div>
    </div>
  )
}