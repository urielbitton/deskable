import { getMonthEventsService, getWeekEventsService } from "app/services/eventsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useWeekEvents = (calendarDate) => {

  const { myUserID } = useContext(StoreContext)
  const [weekEvents, setWeekEvents] = useState([])

  useEffect(() => {
    if(calendarDate.getTime())
    getWeekEventsService(myUserID, calendarDate, setWeekEvents)
  },[myUserID, calendarDate])

  return weekEvents
}

export const useMonthEvents = (calendarDate) => {

  const { myUserID } = useContext(StoreContext)
  const [monthEvents, setMonthEvents] = useState([])

  useEffect(() => {
    if(calendarDate.getTime())
    getMonthEventsService(myUserID, calendarDate, setMonthEvents)
  },[myUserID, calendarDate])

  return monthEvents
}