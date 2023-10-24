import { StoreContext } from "app/store/store"
import { convertClassicTime } from "app/utils/dateUtils"
import React, { useContext } from 'react'
import './styles/EventItem.css'

export default function EventItem(props) {

  const { setNewEventModal } = useContext(StoreContext)
  const { startingDate, endingDate, title, allDay,
    description, eventID, invitees, creatorID } = props.event

  const eventClick = () => {
    setNewEventModal(
      {
        open: true,
        event: {
          startingDate: startingDate?.toDate(),
          endingDate: endingDate?.toDate(),
          title,
          description,
          allDay,
          editMode: true,
          eventID,
          invitees,
          creatorID
        }
      })
  }

  return (
    <div
      className="event-item"
      onClick={() => eventClick()}
    >
      <div className="icon-container">
        <i className="far fa-calendar" />
        <small>{startingDate?.toDate().getDate()}</small>
      </div>
      <div className="event-info">
        <h5>{title}</h5>
        <h6>
          {
            allDay ? 'All Day' :
              <>
                {convertClassicTime(startingDate?.toDate())}
                &nbsp;-&nbsp;
                {convertClassicTime(endingDate?.toDate())}
              </>
          }
        </h6>
      </div>
    </div>
  )
}
