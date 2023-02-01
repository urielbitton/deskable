import React from 'react'
import Board from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'
import './styles/KanbanBoard.css'
import IconContainer from "../ui/IconContainer"

export default function KanbanBoard(props) {

  const { board, removeColumn, renameColumn, addCard } = props

  return (
    <Board
      renderColumnHeader={({title}) => <ColumnHeader title={title} />}
    >
      {board}
    </Board>
  )
}


export function ColumnHeader({title}) {
  return (
    <div className='board-column-header'>
      <h5>{title}</h5>
      <IconContainer
        icon="far fa-elipsis-h"
        iconSize="16px"
        iconColor="var(--grayText)"
        dimensions="24px"
        onClick={() => console.log('clicked')}
      />
    </div>
  )
}