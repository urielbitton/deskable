import React from 'react'
import { Droppable } from "react-beautiful-dnd"

export default function DndDropper({ droppableId, children }) {
  return (
    <Droppable droppableId={droppableId}>
      {
        provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {children}
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  )
}