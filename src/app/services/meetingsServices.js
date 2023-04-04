import { errorToast, successToast } from "app/data/toastsTemplates"
import { db, functions } from "app/firebase/fire"
import { generateRoomID } from "app/utils/generalUtils"
import {
  collection, doc, limit, onSnapshot,
  orderBy,
  query, where
} from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import Video from "twilio-video"
import {
  deleteDB,
  firebaseArrayAdd, firebaseArrayRemove,
  getRandomDocID, setDB, updateDB
} from "./CrudDB"

export const getLiveMeetingsByOrgID = (orgID, setMeetings, lim) => {
  const docRef = collection(db, `organizations/${orgID}/meetings`)
  const q = query(
    docRef,
    where("isActive", "==", true),
    where("meetingEnd", ">=", new Date()),
    orderBy("meetingEnd", "asc"),
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

export const getRangedMeetingsByOrgID = (orgID, start, end, setMeetings, lim) => {
  const docRef = collection(db, `organizations/${orgID}/meetings`)
  const q = query(
    docRef,
    where("meetingStart", ">=", start),
    where("meetingStart", "<=", end),
    orderBy("meetingStart", "desc"),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setMeetings(snapshot.docs.map(doc => doc.data()))
  })
}


// services function

export const getUserMediaDevices = () => {
  if (navigator?.mediaDevices?.getUserMedia) {
    return navigator?.mediaDevices?.getUserMedia({ video: true, audio: false })
      .catch(err => console.log("Something went wrong getting your media devices."))
  }
  else {
    alert("Your browser does not support video or audio.")
  }
}

export const stopVideoCameraService = (mediaStreamRef) => {
  mediaStreamRef.getVideoTracks()?.forEach(track => track.stop())
}

export const createJoinVideoMeetingService = (myUserID, accountType, roomID, roomType, setPageLoading, setToasts) => {
  setPageLoading(true)
  return httpsCallable(functions, 'findOrCreateRoom')({
    roomName: roomID,
    roomType,
    accountType
  })
    .then(() => {
      return httpsCallable(functions, 'getRoomAccessToken')({
        roomName: roomID,
        userID: myUserID
      })
    })
    .then((result) => {
      setPageLoading(false)
      setToasts(successToast("Meeting joined."))
      return result.data
    })
    .catch((error) => {
      setPageLoading(false)
      setToasts(errorToast('There was an error joining the meeting. Please try again'))
      console.log(error)
    })
}

export const joinVideoRoomService = (token, videoOn, soundOn, setPageLoading) => {
  setPageLoading(true)
  return Video.connect(token, {
    video: videoOn,
    audio: soundOn,
    dominantSpeaker: true,
  })
    .then((room) => {
      console.log(room)
      setPageLoading(false)
      return room
    })
    .catch((error) => {
      setPageLoading(false)
      console.error(`Unable to connect to Room: ${error.message}`)
    })
}

export const shareScreenService = (room, setScreenTrack, setIsScreenSharing) => {
  return navigator.mediaDevices.getDisplayMedia()
    .then(stream => {
      const screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0], { name: 'myscreenshare' })
      setScreenTrack(screenTrack)
      room.localParticipant.publishTrack(screenTrack, {
        name: 'myscreenshare', priority: 'high'
      })
      setIsScreenSharing(true)
    })
    .catch(() => {
      setIsScreenSharing(false)
      alert('Could not share the screen.')
    })
}

export const stopSharingScreenService = (room, screenTrack, setIsScreenSharing) => {
  screenTrack.stop()
  room.localParticipant.unpublishTrack(screenTrack)
  room.localParticipant.videoTracks.forEach(publication => {
    if (publication.track.name === 'screen') {
      publication.track.stop()
      publication.unpublish()
    }
  })
  setIsScreenSharing(false)
}

export const addMeetingParticipantService = (orgID, meetingID, userID) => {
  const path = `organizations/${orgID}/meetings`
  return updateDB(path, meetingID, {
    participants: firebaseArrayAdd(userID)
  })
    .catch((error) => {
      console.log(error)
    })
}

export const removeMeetingParticipantService = (orgID, meetingID, userID) => {
  const path = `organizations/${orgID}/meetings`
  return updateDB(path, meetingID, {
    participants: firebaseArrayRemove(userID)
  })
    .catch((error) => {
      console.log(error)
    })
}

export const switchMeetingInactiveService = (orgID, meetingID) => {
  const path = `organizations/${orgID}/meetings`
  return updateDB(path, meetingID, {
    isActive: false
  })
    .catch((error) => {
      console.log(error)
    })
}

export const createMeetingService = (orgID, meeting, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/meetings`
  const docID = getRandomDocID(path)
  const roomID = generateRoomID()
  return setDB(path, docID, {
    invitees: meeting.invitees,
    isActive: true,
    isPublic: meeting.isPublic,
    meetingEnd: meeting.meetingEnd,
    meetingID: docID,
    meetingStart: meeting.meetingStart,
    orgID,
    organizerID: meeting.organizerID,
    participants: [],
    roomID,
    title: meeting.title
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Meeting created."))
    })
    .catch((error) => {
      setLoading(false)
      setToasts(errorToast('There was an error creating the meeting. Please try again'))
      console.log(error)
    })
}

export const closeMeetingRoomService = (orgID, meetingID, setToasts, setLoading) => {
  const meetingPath = `organizations/${orgID}/meetings`
  setLoading(true)
  return httpsCallable(functions, 'recursivelyDeleteDocument')({
    path: meetingPath, documentID: meetingID
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("The meeting room was closed."))
    })
    .catch((error) => {
      setLoading(false)
      setToasts(errorToast('There was an error closing the meeting room. Please try again'))
      console.log(error)
    })
}