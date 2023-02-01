import React from 'react'
import KanbanBoard from "./KanbanBoard"

export default function ProjectBoard() {

  const board = {
    columns: [
      {
        id: 1,
        title: 'To Do',
        cards: [
          {
            id: 1,
            title: 'Add card',
            description: 'Add capability to add a card in a column'
          },
        ]
      },
      {
        id: 2,
        title: 'Doing',
        cards: [
          {
            id: 2,
            title: 'Drag-n-drop support',
            description: 'Move a card between the columns'
          },
        ]
      },
      {
        id: 3,
        title: 'Done',
        cards: [
          {
            id: 3,
            title: 'Done task',
            description: 'Move a card between the columns'
          },
        ]
      }
    ]
  }

  const removeColumn = () => {

  }

  const renameColumn = () => {

  }

  const addCard = () => {

  }

  return (
    <div className="kanban-board-container">
      <KanbanBoard
        board={board}
        removeColumn={removeColumn}
        renameColumn={renameColumn}
        addCard={addCard}
      />
    </div>
  )
}
