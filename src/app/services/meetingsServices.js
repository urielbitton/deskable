import { db } from "app/firebase/fire"
import { collection, doc, limit, onSnapshot, 
  query, where } from "firebase/firestore"

export const getLiveMeetingsByOrgID = (orgID, setMeetings, lim) => {
  const docRef = collection(db, `organizations/${orgID}/meetings`)
  const q = query(
    docRef, 
    where("isActive", "==", true), 
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setMeetings(snapshot.docs.map(doc => doc.data()))
  })
}

export const getMeetingByID = (orgID, meetingID, setMeeting) => {
  const docRef = doc(db, `organizations/${orgID}/meetings`, meetingID)
  onSnapshot(docRef, (doc) => {
    setMeeting(doc.data())
  })
}

export const getTodayMeetingsByOrgID = (orgID, setMeetings, lim) => {
  const docRef = collection(db, `organizations/${orgID}/meetings`)
  const q = query(
    docRef, 
    where("meetingStart", ">=", new Date().setHours(0,0,0,0)), 
    where("meetingStart", "<=", new Date().setHours(23,59,59,999)), 
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setMeetings(snapshot.docs.map(doc => doc.data()))
  })
}

