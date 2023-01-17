import React, { useEffect, useState } from 'react'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { convertDateToInputDateAndTimeFormat, 
  reformatDateToMonthDayYear } from "app/utils/dateUtils"
import AppButton from "./AppButton"
import './styles/AppCalendar.css'

export default function AppCalendar(props) {

  const { onDateClick, onEventClick, onEventDrop, onEventResize,
    events, initialView, eventClassNames, calendarRef, eventContent, 
    showToolbar, viewMode, setViewMode, setCalendarRangeStartDate, 
    setCalendarRangeEndDate } = props
  const [customCalendarViewTitle, setCustomCalendarViewTitle] = useState('')
  const calendarAPI = calendarRef?.current?.getApi()

  const handleDateChange = (event) => {
    if (event === 'prev')
      calendarAPI.prev()
    else if (event === 'next')
      calendarAPI.next()
    else if (event === 'today')
      calendarAPI.today()
    setCustomCalendarViewTitle(calendarAPI?.currentDataManager?.data?.viewTitle)
    setCalendarRangeStartDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.activeRange?.start))
    setCalendarRangeEndDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.activeRange?.end))
  }

  useEffect(() => {
    setCustomCalendarViewTitle(calendarAPI?.currentDataManager?.data?.viewTitle)
    setCalendarRangeStartDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.activeRange?.start))
    setCalendarRangeEndDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.activeRange?.end))
  }, [calendarAPI])

  useEffect(() => {
    calendarAPI?.changeView(viewMode)
    setCustomCalendarViewTitle(calendarAPI?.currentDataManager?.data?.viewTitle)
    setCalendarRangeStartDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.activeRange?.start))
    setCalendarRangeEndDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.activeRange?.end))
  }, [viewMode])

  return (
    <div className="app-calendar">
      {
        showToolbar &&
        <div className="headerToolbar">
          <div className="leftBar">
            <div className="iconsContainer">
              <div
                className={viewMode === 'timeGridWeek' ? 'active' : ''}
                onClick={() => setViewMode('timeGridWeek')}
                title="Weekly View"
              >
                <i className="fas fa-calendar-week" />
              </div>
              <div
                className={viewMode === 'dayGridMonth' ? 'active' : ''}
                onClick={() => setViewMode('dayGridMonth')}
                title="Monthly View"
              >
                <i className="fas fa-calendar-alt" />
              </div>
              <div
                className={viewMode === 'timeGridDay' ? 'active' : ''}
                onClick={() => setViewMode('timeGridDay')}
                title="Day View"
              >
                <i className="fas fa-calendar-day" />
              </div>
            </div>
          </div>
          <div className='centerBar'>
            <div
              className="iconContainer"
              onClick={() => handleDateChange('prev')}
            >
              <i className="fal fa-angle-left" />
            </div>
            <h4>{customCalendarViewTitle}</h4>
            <div
              className="iconContainer"
              onClick={() => handleDateChange('next')}
            >
              <i className="fal fa-angle-right"></i>
            </div>
          </div>
          <div className="rightBar">
            <AppButton
              label="Today"
              onClick={() => handleDateChange('today')}
            />
          </div>
        </div>
      }
      <FullCalendar
        dateClick={onDateClick}
        dayMaxEvents
        droppable
        eventDurationEditable
        events={events}
        editable
        eventClick={onEventClick}
        eventDataTransform={(e) => {
          e.start = `${convertDateToInputDateAndTimeFormat(e.startingDate?.toDate())}`
          e.end = `${convertDateToInputDateAndTimeFormat(e.endingDate?.toDate())}`
          return e
        }}
        eventStartEditable
        eventResize={onEventResize}
        eventClassNames={eventClassNames}
        eventContent={eventContent}
        eventDrop={onEventDrop}
        eventResizableFromStart
        fixedWeekCount={false}
        headerToolbar={false}
        initialView={initialView}
        navLinks
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        ref={calendarRef}
        themeSystem="Solar"
      />
    </div>
  )
}
