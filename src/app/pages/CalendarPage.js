import AppCalendar from "app/components/ui/AppCalendar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { useCalendarEvent, useCalendarMonthEvents, useCalendarWeekEvents } from "app/hooks/calendarHooks"
import React, { useContext, useRef, useState } from 'react'
import './styles/CalendarPage.css'
import { StoreContext } from "app/store/store"
import { useSearchParams } from "react-router-dom"

export default function CalendarPage() {

  const { setNewEventModal } = useContext(StoreContext)
  const [viewMode, setViewMode] = useState('timeGridWeek')
  const [calendarRangeStartDate, setCalendarRangeStartDate] = useState(new Date())
  const [calendarRangeEndDate, setCalendarRangeEndDate] = useState(new Date())
  const [customCalendarViewTitle, setCustomCalendarViewTitle] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const eventID = searchParams.get('eventID')
  const calendarRef = useRef(null)
  const weekEvents = useCalendarWeekEvents(calendarRangeStartDate)
  const monthEvents = useCalendarMonthEvents(calendarRangeStartDate)
  const monthView = viewMode === 'dayGridMonth'

  return (
    <div className="calendar-page">
      <HelmetTitle title="Calendar" />
      <AppCalendar
        events={monthView ? monthEvents : weekEvents}
        viewMode={viewMode}
        setViewMode={setViewMode}
        calendarRef={calendarRef}
        initialView={viewMode}
        setCalendarRangeStartDate={setCalendarRangeStartDate}
        setCalendarRangeEndDate={setCalendarRangeEndDate}
        customCalendarViewTitle={customCalendarViewTitle}
        setCustomCalendarViewTitle={setCustomCalendarViewTitle}
        showToggler
        showTodayBtn
        allDaySlot={false}
      />
    </div>
  )
}
