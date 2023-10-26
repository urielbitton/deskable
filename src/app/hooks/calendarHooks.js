import {
  getCalendarEventService, getMonthCalendarEventsService, 
  getTodayTasksService, getWeekCalendarEventsService
} from "app/services/calendarServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCalendarEvent = (eventID) => {

  const { myOrgID } = useContext(StoreContext)
  const [event, setEvent] = useState({})

  useEffect(() => {
    if (eventID)
      getCalendarEventService(myOrgID, eventID, setEvent)
  }, [myOrgID, eventID])

  return event
}

export const useCalendarWeekEvents = (calendarDate) => {

  const { myOrgID, myUserID } = useContext(StoreContext)
  const [weekEvents, setWeekEvents] = useState([])

  useEffect(() => {
    if (calendarDate.getTime())
      getWeekCalendarEventsService(myOrgID, myUserID, calendarDate, setWeekEvents)
  }, [myOrgID, calendarDate])

  return weekEvents
}

export const useCalendarMonthEvents = (calendarDate) => {

  const { myUserID, myOrgID } = useContext(StoreContext)
  const [monthEvents, setMonthEvents] = useState([])

  useEffect(() => {
    if (calendarDate.getTime())
      getMonthCalendarEventsService(myOrgID, myUserID, calendarDate, setMonthEvents)
  }, [myUserID, calendarDate])

  return monthEvents
}

export const useTodayTasks = () => {

  const { myUserID } = useContext(StoreContext)
  const [todayTasks, setTodayTasks] = useState([])

  useEffect(() => {
    getTodayTasksService(myUserID, setTodayTasks)
  }, [myUserID])

  return todayTasks
}