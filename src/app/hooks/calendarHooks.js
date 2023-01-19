import { getMonthCalendarEventsService, getTodayTasksService, getWeekCalendarEventsService } from "app/services/calendarServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCalendarWeekEvents = (calendarDate) => {

  const { myUserID } = useContext(StoreContext)
  const [weekEvents, setWeekEvents] = useState([])

  useEffect(() => {
    if(calendarDate.getTime())
    getWeekCalendarEventsService(myUserID, calendarDate, setWeekEvents)
  },[myUserID, calendarDate])

  return weekEvents
}

export const useCalendarMonthEvents = (calendarDate) => {

  const { myUserID } = useContext(StoreContext)
  const [monthEvents, setMonthEvents] = useState([])

  useEffect(() => {
    if(calendarDate.getTime())
    getMonthCalendarEventsService(myUserID, calendarDate, setMonthEvents)
  },[myUserID, calendarDate])

  return monthEvents
}

export const useTodayTasks = () => {

  const { myUserID } = useContext(StoreContext)
  const [todayTasks, setTodayTasks] = useState([])

  useEffect(() => {
    getTodayTasksService(myUserID, setTodayTasks)
  },[myUserID])

  return todayTasks
}