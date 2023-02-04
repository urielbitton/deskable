import React, { useState } from 'react'
import { AppInput } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"

export default function BoardColumn(props) {

  const { title, columnID, renameColumn, removeColumn, initAddTask,
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

  const initAddColumnTask = () => {
    initAddTask(columnID)
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
        onClick={initAddColumnTask}
      >
        <i className="fal fa-plus" />
      </div>
    </div>
  )
}

