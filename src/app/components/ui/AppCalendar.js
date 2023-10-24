import React, { useContext, useEffect } from 'react'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import {
  convertDateToInputDateAndTimeFormat,
  reformatDateToMonthDayYear
} from "app/utils/dateUtils"
import AppButton from "./AppButton"
import './styles/AppCalendar.css'
import { StoreContext } from "app/store/store"
import {
  dateChangeService, dateClickService,
  eventClickService, eventResizeOrMoveService
} from "app/services/calendarServices"

export default function AppCalendar(props) {

  const { setNewEventModal, myOrgID, setToasts,
    setPageLoading, myUserID } = useContext(StoreContext)
  const { events, initialView, eventClassNames, calendarRef,
    eventContent, showToggler, showTodayBtn, viewMode, setViewMode,
    setCalendarRangeStartDate, setCalendarRangeEndDate,
    customCalendarViewTitle, setCustomCalendarViewTitle,
    allDaySlot } = props
  const calendarAPI = calendarRef?.current?.getApi()
  const monthView = viewMode === 'dayGridMonth'

  const handleDateChange = (event) => {
    dateChangeService(
      event,
      calendarAPI,
      setCustomCalendarViewTitle,
      setCalendarRangeStartDate,
      setCalendarRangeEndDate
    )
  }

  const handleDateClick = (e) => {
    dateClickService(
      e,
      monthView,
      setNewEventModal
    )
  }

  const handleEventResizeOrMove = (e) => {
    eventResizeOrMoveService(
      e,
      myOrgID,
      myUserID,
      setToasts,
      setPageLoading,
      setNewEventModal
    )
  }

  const handleEventClick = (e) => {
    eventClickService(
      e,
      setNewEventModal
    )
  }

  const handleDataTransform = (e) => {
    e.start = `${convertDateToInputDateAndTimeFormat(e.startingDate?.toDate())}`
    e.end = `${convertDateToInputDateAndTimeFormat(e.endingDate?.toDate())}`
    return e
  }

  const renderEventDots = (e) => {
    return <span className="event-dots-flex">
      {
        Array.apply(null, Array(e.num)).map(() => <div className="event-dot" />)
      }
    </span>
  }

  useEffect(() => {
    setCustomCalendarViewTitle(calendarAPI?.currentDataManager?.data?.viewTitle)
    setCalendarRangeStartDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.currentRange?.start))
    setCalendarRangeEndDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.currentRange?.end))
  }, [calendarAPI])

  useEffect(() => {
    calendarAPI?.changeView(viewMode)
    setCustomCalendarViewTitle(calendarAPI?.currentDataManager?.data?.viewTitle)
    setCalendarRangeStartDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.currentRange?.start))
    setCalendarRangeEndDate(reformatDateToMonthDayYear(calendarAPI?.currentDataManager?.data?.dateProfile?.currentRange?.end))
  }, [viewMode])

  return (
    <div className="app-calendar">
      <div className="headerToolbar">
        {
          showToggler &&
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
        }
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
        {
          showTodayBtn &&
          <div className="rightBar">
            <AppButton
              label="Today"
              onClick={() => handleDateChange('today')}
            />
          </div>
        }
      </div>
      <FullCalendar
        dateClick={handleDateClick}
        dayMaxEvents
        droppable
        eventDurationEditable
        events={events}
        editable
        eventClick={handleEventClick}
        eventDataTransform={handleDataTransform}
        eventStartEditable
        eventDrop={handleEventResizeOrMove}
        eventResize={handleEventResizeOrMove}
        eventClassNames={eventClassNames}
        eventContent={eventContent}
        eventResizableFromStart
        fixedWeekCount={false}
        headerToolbar={false}
        initialView={initialView}
        navLinks
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        ref={calendarRef}
        themeSystem="Solar"
        moreLinkContent={(e) => renderEventDots(e)}
        dayMaxEventRows={3}
        allDaySlot={allDaySlot}
      />
    </div>
  )
}
