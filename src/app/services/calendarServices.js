import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { reformatDateToMonthDayYear } from "app/utils/dateUtils"
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { createMeetingService } from "./meetingsServices"
import { generateRoomID } from "app/utils/generalUtils"

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
  const event = {
    startingDate: startDate,
    endingDate: endDate,
    title: '',
    description: '',
    allDay: monthView,
    invitees: [],
    creatorID: '',
    meetingID: null,
    roomID: null,
  }
  setNewEventModal({ open: true, event })
}

export const eventResizeOrMoveService = (e, orgID, myUserID, setToasts, setLoading, setNewEventModal) => {
  const event = {
    startingDate: e.event.start,
    endingDate: e.event.end,
    title: e.event.title,
    description: e.event.extendedProps.description,
    allDay: e.event.allDay,
    eventID: e.event.extendedProps.eventID,
  }
  updateCalendarEventService(orgID, myUserID, event, setToasts, setLoading)
    .then(() => {
      setNewEventModal({ open: false, event: null })
    })
}

export const eventClickService = (e, setNewEventModal) => {
  const event = {
    startingDate: e.event.start,
    endingDate: e.event.end,
    title: e.event.title,
    description: e.event.extendedProps.description,
    allDay: e.event.allDay,
    editMode: true,
    eventID: e.event.extendedProps.eventID,
    invitees: e.event.extendedProps.invitees,
    creatorID: e.event.extendedProps.creatorID,
    meetingID: e.event.extendedProps.meetingID,
    roomID: e.event.extendedProps.roomID,
  }
  setNewEventModal({ open: true, event })
}

export const getWeekCalendarEventsService = (orgID, userID, calendarDate, setEvents) => {
  const eventsRef = collection(db, `organizations/${orgID}/events`)
  const q = query(
    eventsRef,
    where('invitees', 'array-contains', userID),
    where('startingDate', '>=', startOfWeek(calendarDate)),
    where('startingDate', '<=', endOfWeek(calendarDate)),
    orderBy('startingDate', 'desc')
  )
  onSnapshot(q, (snapshot) => {
    setEvents(snapshot.docs.map(doc => doc.data()))
  })
}

export const getMonthCalendarEventsService = (orgID, userID, calendarDate, setEvents) => {
  const eventsRef = collection(db, `organizations/${orgID}/events`)
  const q = query(
    eventsRef,
    where('invitees', 'array-contains', userID),
    where('startingDate', '>=', startOfMonth(calendarDate)),
    where('startingDate', '<=', endOfMonth(calendarDate)),
    orderBy('startingDate', 'desc')
  )
  onSnapshot(q, (snapshot) => {
    setEvents(snapshot.docs.map(doc => doc.data()))
  })
}



export const createCalendarEventService = async (orgID, myUserID, invitees, event, createVideoMeeting, setToasts, setLoading) => {
  setLoading(true)
  const eventPath = `organizations/${orgID}/events`
  const docID = getRandomDocID(eventPath)
  try {
    await setDB(eventPath, docID, {
      ...event,
      eventID: docID,
      dateCreated: new Date(),
      creatorID: myUserID,
      invitees: [...invitees, myUserID],
      orgID,
    })
    setLoading(false)
    if (!createVideoMeeting) return { eventID: docID }
    const meetingRes = await createMeetingService(
      orgID,
      {
        invitees,
        isActive: true,
        isPublic: false,
        meetingEnd: event.endingDate,
        meetingStart: event.startingDate,
        participants: [],
        orgID,
        organizerID: myUserID,
        title: event.title,
        raisedHands: [],
      },
      setLoading,
      setToasts
    )
    const { meetingID, roomID } = meetingRes
    await updateCalendarEventService(
      orgID,
      docID,
      {
        meetingID,
        roomID
      },
      setToasts,
      setLoading
    )
    return { eventID: docID, meetingID, roomID }
  }
  catch (err) {
    console.log(err)
    setLoading(false)
    setToasts(errorToast('Error saving event. Please try again.', true))
  }
}

export const updateCalendarEventService = (orgID, eventID, event, setToasts, setLoading) => {
  setLoading(true)
  return updateDB(`organizations/${orgID}/events`, eventID, {
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

export const deleteCalendarEventService = (orgID, eventID, setToasts, setLoading) => {
  setLoading(true)
  return deleteDB(`organizations/${orgID}/events`, eventID)
    .then(() => {
      setToasts(successToast('Event deleted successfully.'))
      setLoading(false)
    })
    .catch((err) => {
      setToasts(errorToast('Error deleting event. Please try again.'))
      console.log(err)
    })
}

export const addMeetingInfoToEventService = (orgID, eventID, meetingID, roomID) => {
  return updateDB(`organizations/${orgID}/events`, eventID, {
    meetingID,
    roomID
  })
    .catch(err => {
      console.log(err)
    })
}


//tasks services

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

export const createTaskService = (userID, orgID, title, setToasts, setLoading) => {
  setLoading(true)
  const taskPath = `users/${userID}/tasks`
  const docID = getRandomDocID(taskPath)
  return setDB(taskPath, docID, {
    taskID: docID,
    dateCreated: new Date(),
    creatorID: userID,
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