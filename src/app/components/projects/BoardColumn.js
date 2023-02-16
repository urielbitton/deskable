import React, { useState } from 'react'
import { AppInput } from "../ui/AppInputs"
import DropdownIcon from "../ui/DropDownIcon"
import IconContainer from "../ui/IconContainer"

export default function BoardColumn(props) {

  const { title, columnID, renameColumn, removeColumn, initAddTask,
    editTitleMode, setEditTitleMode, tasksNum } = props
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

  const cancelEditTitle = () => {
    setEditTitleMode(null)
    setEditTitle('')
  }

  const deleteColumn = () => {
    removeColumn(columnID)
  }

  const initAddColumnTask = () => {
    initAddTask(columnID)
  }

  return (
    <div 
      className="board-column-header"
      key={columnID}
    >
      <div className="top">
        {
          editTitleMode !== columnID ?
            <h5>{title} {tasksNum > 0 && `(${tasksNum})`}</h5> :
            <AppInput
              placeholder="Column title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveHeaderTitle()}
            />
        }
        <div className="edit-icons">
          {
            editTitleMode === columnID &&
            <>
              {
                editTitle?.length > 0 && editTitle !== title &&
                <IconContainer
                  icon="far fa-check"
                  onClick={() => saveHeaderTitle()}
                  iconColor="var(--grayText)"
                  dimensions={24}
                />
              }
              <IconContainer
                icon="far fa-times"
                onClick={() => cancelEditTitle()}
                iconColor="var(--grayText)"
                dimensions={24}
              />
            </>
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

