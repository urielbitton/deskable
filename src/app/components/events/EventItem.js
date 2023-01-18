import { convertClassicTime } from "app/utils/dateUtils"
import React from 'react'
import './styles/EventItem.css'

export default function EventItem(props) {

  const { startingDate, endingDate, title, allDay } = props.event

  return (
    <div className="event-item">
      <div className="icon-container">
        <i className="fal fa-calendar" />
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
