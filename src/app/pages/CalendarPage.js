import AppCalendar from "app/components/ui/AppCalendar"
import { useMonthEvents, useWeekEvents } from "app/hooks/eventHooks"
import { updateEventService } from "app/services/eventsServices"
import { StoreContext } from "app/store/store"
import { reformatDateToMonthDayYear } from "app/utils/dateUtils"
import React, { useContext, useRef, useState } from 'react'
import './styles/CalendarPage.css'

export default function CalendarPage() {

  const { setNewEventModal, myUserID, setToasts, 
    setPageLoading } = useContext(StoreContext)
  const [viewMode, setViewMode] = useState('timeGridWeek')
  const [calendarRangeStartDate, setCalendarRangeStartDate] = useState(new Date())
  const [calendarRangeEndDate, setCalendarRangeEndDate] = useState(new Date())
  const calendarRef = useRef(null)
  const weekEvents = useWeekEvents(calendarRangeStartDate)
  const monthEvents = useMonthEvents(calendarRangeStartDate)
  const monthView = viewMode === 'dayGridMonth'

  const handleDateClick = (e) => {
    const startDate = new Date(e.date)
    const endDate = new Date(e.date.setHours(e.date.getHours() + 1))
    const eventObject = {
      startingDate: startDate,
      endingDate: endDate,
      title: '',
      description: '',
      allDay: monthView
    }
    setNewEventModal({ open: true, eventObject })
  }

  const handleEventResizeOrMove = (e) => {
    const eventObject = {
      startingDate: e.event.start,
      endingDate: e.event.end,
      title: e.event.title,
      description: e.event.extendedProps.description,
      allDay: e.event.allDay,
      eventID: e.event.extendedProps.eventID
    }
    updateEventService(myUserID, eventObject, setToasts, setPageLoading)
    .then(() => {
      setNewEventModal({ open: false, eventObject: null })
    })
  }

  const handleEventClick = (e) => {
    const eventObject = {
      startingDate: e.event.start,
      endingDate: e.event.end,
      title: e.event.title,
      description: e.event.extendedProps.description,
      allDay: e.event.allDay,
      editMode: true,
      eventID: e.event.extendedProps.eventID
    }
    setNewEventModal({ open: true, eventObject })
  }

  return (
    <div className="calendar-page">
      <AppCalendar
        onDateClick={(e) => handleDateClick(e)}
        onEventClick={(e) => handleEventClick(e)}
        events={monthView ? monthEvents : weekEvents}
        onEventDrop={(e) => handleEventResizeOrMove(e)}
        onEventResize={(e) => handleEventResizeOrMove(e)}
        showToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        calendarRef={calendarRef}
        initialView={viewMode}
        setCalendarRangeStartDate={setCalendarRangeStartDate}
        setCalendarRangeEndDate={setCalendarRangeEndDate}
      />
    </div>
  )
}
