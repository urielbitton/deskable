import { reformatDateToMonthDayYear } from "app/utils/dateUtils"
import { updateEventService } from "./eventsServices"

export const dateChangeService = (event, calendarAPI, setCustomCalendarViewTitle, setCalendarRangeStartDate, setCalendarRangeEndDate) => {
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

export const dateClickService = (e, monthView, setNewEventModal) => {
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

export const eventResizeOrMoveService = (e, userID, setToasts, setLoading, setNewEventModal) => {
  const eventObject = {
    startingDate: e.event.start,
    endingDate: e.event.end,
    title: e.event.title,
    description: e.event.extendedProps.description,
    allDay: e.event.allDay,
    eventID: e.event.extendedProps.eventID
  }
  updateEventService(userID, eventObject, setToasts, setLoading)
    .then(() => {
      setNewEventModal({ open: false, eventObject: null })
    })
}

export const eventClickService = (e, setNewEventModal) => {
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