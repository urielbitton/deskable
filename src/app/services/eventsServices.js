import { errorToast, successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"


export const getWeekEventsService = (userID, calendarDate, setEvents) => {
  return db.collection('users')
    .doc(userID)
    .collection('events')
    .where('startingDate', '>=', startOfWeek(calendarDate))
    .where('startingDate', '<=', endOfWeek(calendarDate))
    .orderBy('startingDate', 'desc')
    .onSnapshot(snapshot => {
      setEvents(snapshot.docs.map(doc => doc.data()))
    })
}

export const getMonthEventsService = (userID, calendarDate, setEvents) => {
  return db.collection('users')
    .doc(userID)
    .collection('events')
    .where('startingDate', '>=', startOfMonth(calendarDate))
    .where('startingDate', '<=', endOfMonth(calendarDate))
    .orderBy('startingDate', 'desc')
    .onSnapshot(snapshot => {
      setEvents(snapshot.docs.map(doc => doc.data()))
    })
}



export const createEventService = (userID, event, setToasts, setLoading) => {
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
      setToasts(errorToast('Error saving event. Please try again.'))
    })
}

export const updateEventService = (userID, event, setToasts, setLoading) => {
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
      setToasts(errorToast('Error updating event. Please try again.'))
    })
}

export const deleteEventService = (userID, eventID, setToasts, setLoading) => {
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