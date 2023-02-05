import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { reformatDateToMonthDayYear } from "app/utils/dateUtils"
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"

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
  updateCalendarEventService(userID, eventObject, setToasts, setLoading)
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

export const getWeekCalendarEventsService = (userID, calendarDate, setEvents) => {
  const eventsRef = collection(db, `users/${userID}/events`)
  const q = query(
    eventsRef, 
    where('startingDate', '>=', startOfWeek(calendarDate)),
    where('startingDate', '<=', endOfWeek(calendarDate)),
    orderBy('startingDate', 'desc') 
  )
  onSnapshot(q, (snapshot) => {
    setEvents(snapshot.docs.map(doc => doc.data()))
  })
}

export const getMonthCalendarEventsService = (userID, calendarDate, setEvents) => {
  const eventsRef = collection(db, `users/${userID}/events`)
  const q = query(
    eventsRef, 
    where('startingDate', '>=', startOfMonth(calendarDate)),
    where('startingDate', '<=', endOfMonth(calendarDate)),
    orderBy('startingDate', 'desc') 
  )
  onSnapshot(q, (snapshot) => {
    setEvents(snapshot.docs.map(doc => doc.data()))
  })
}



export const createCalendarEventService = (userID, event, setToasts, setLoading) => {
  setLoading(true)
  const eventPath = `users/${userID}/events`
  const docID = getRandomDocID(eventPath)
  return setDB(eventPath, docID, {
    ...event,
    eventID: docID,
    dateCreated: new Date(),
    ownerID: userID,
  })
    .then(() => {
      setToasts(successToast('Event saved successfully'))
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('Error saving event. Please try again.', true))
    })
}

export const updateCalendarEventService = (userID, event, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(`users/${userID}/events`, event.eventID, {
    ...event
  })
    .then(() => {
      setToasts(successToast('Event updated successfully'))
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('Error updating event. Please try again.', true))
    })
}

export const deleteCalendarEventService = (userID, eventID, setToasts, setLoading) => {
  setLoading(true)
  return deleteDB(`users/${userID}/events`, eventID)
    .then(() => {
      setToasts(successToast('Event deleted successfully.'))
      setLoading(false)
    })
    .catch((err) => {
      setToasts(errorToast('Error deleting event. Please try again.'))
      console.log(err)
    })
}

export const getTodayTasksService = (userID, setTasks) => {
  const tasksRef = collection(db, `users/${userID}/tasks`)
  const q = query(
    tasksRef,
    where('dateCreated', '>=', startOfDay(new Date())),
    where('dateCreated', '<=', endOfDay(new Date())),
    orderBy('dateCreated', 'desc')
  )
  onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(doc => doc.data()))
  })
}

export const createTaskService = (userID, title, setToasts, setLoading) => {
  setLoading(true)
  const taskPath = `users/${userID}/tasks`
  const docID = getRandomDocID(taskPath)
  return setDB(taskPath, docID, {
    taskID: docID,
    dateCreated: new Date(),
    ownerID: userID,
    title,
    isDone: false
  })
    .then(() => {
      setToasts(successToast('Task saved successfully'))
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('Error saving task. Please try again.'))
    })
}

export const updateTaskService = (userID, task, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(`users/${userID}/tasks`, task.taskID, {
    title: task.title,
    isDone: task.isDone
  })
    .then(() => {
      setToasts(successToast('Task updated successfully'))
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast('Error updating task. Please try again.'))
    })
}

export const deleteTaskService = (userID, taskID, setToasts, setLoading) => {
  setLoading(true)
  return deleteDB(`users/${userID}/tasks`, taskID)
    .then(() => {
      setToasts(successToast('Task deleted successfully.'))
      setLoading(false)
    })
    .catch((err) => {
      setToasts(errorToast('Error deleting task. Please try again.'))
      console.log(err)
    })
}