import AppCalendar from "app/components/ui/AppCalendar"
import { useCalendarMonthEvents, useCalendarWeekEvents } from "app/hooks/eventHooks"
import React, { useRef, useState } from 'react'
import './styles/CalendarPage.css'

export default function CalendarPage() {

  const [viewMode, setViewMode] = useState('timeGridWeek')
  const [calendarRangeStartDate, setCalendarRangeStartDate] = useState(new Date())
  const [calendarRangeEndDate, setCalendarRangeEndDate] = useState(new Date())
  const [customCalendarViewTitle, setCustomCalendarViewTitle] = useState('')
  const calendarRef = useRef(null)
  const weekEvents = useCalendarWeekEvents(calendarRangeStartDate)
  const monthEvents = useCalendarMonthEvents(calendarRangeStartDate)
  const monthView = viewMode === 'dayGridMonth'

  return (
    <div className="calendar-page">
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
      />
    </div>
  )
}
