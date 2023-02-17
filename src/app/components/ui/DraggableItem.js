import React from 'react'
import { Draggable } from "react-beautiful-dnd"

export default function DraggableItem({ draggableId, index, children }) {
  return (
    <Draggable
      draggableId={draggableId}
      index={index}
    >
      {
        (provided, snapshot) => (
          <div
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
          >
            {children}
          </div>
        )
      }
    </Draggable>
  )
}
