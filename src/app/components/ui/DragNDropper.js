import React from 'react'
import { DragDropContext, Droppable } from "react-beautiful-dnd"

export default function DragNDropper({ onDragStart, onDragEnd, droppableId, children }) {
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
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
    </DragDropContext>
  )
}