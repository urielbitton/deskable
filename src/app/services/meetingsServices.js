import { errorToast, successToast } from "app/data/toastsTemplates"
import { db, functions } from "app/firebase/fire"
import {
  collection, doc, limit, onSnapshot,
  orderBy,
  query, where
} from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import Video from "twilio-video"

export const getLiveMeetingsByOrgID = (orgID, setMeetings, lim) => {
  const docRef = collection(db, `organizations/${orgID}/meetings`)
  const q = query(
    docRef,
    where("isActive", "==", true),
    orderBy("meetingStart", "desc"),
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

export const createJoinVideoMeetingService = (myUserID, roomID, setPageLoading, setToasts) => {
  setPageLoading(true)
  return httpsCallable(functions, 'findOrCreateRoom')({
    roomName: roomID
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
      console.log(result.data)
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
    audio: soundOn
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

export const handleConnectedParticipant = (participant, myUserID) => {
  const participantClass = participant.identity === myUserID ? "participant my-participant" : "participant participants"
  const participantDiv = document.createElement("div")
  participantDiv.setAttribute("id", participant.identity)
  participantDiv.setAttribute("class", participantClass)
  if(participant.identity === myUserID) {
    document.querySelector('.video-container').append(participantDiv)
  }
  else {
    document.querySelector('.participants-list').prepend(participantDiv)
  }
  participant.tracks.forEach((trackPublication) => {
    handleTrackPublication(trackPublication, participant)
  })
  participant.on("trackPublished", handleTrackPublication)
}

export const handleTrackPublication = (trackPublication, participant) => {
  function displayTrack(track) {
    const participantDiv = document.querySelector(`#${participant.identity}`)
    const trackElement = track.attach()
    participantDiv.append(trackElement)
  }
  if (trackPublication.track) {
    displayTrack(trackPublication.track)
  }
  trackPublication.on("subscribed", displayTrack)
}

export const handleDisconnectedParticipant = (participant) => {
  participant.removeAllListeners()
  const participantDiv = document.getElementById(participant.identity)
  participantDiv.remove()
}

export const shareScreenService = (room) => {
  navigator.mediaDevices.getDisplayMedia()
  .then(stream => {
    const screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0])
    room.localParticipant.publishTrack(screenTrack);
  })
  .catch(() => {
    alert('Could not share the screen.')
  })
}

export const stopSharingScreenService = (room) => {
  const screenTrack = room.localParticipant.videoTracks.values().next().value[1].track
  room.localParticipant.unpublishTrack(screenTrack)
  screenTrack.stop()
}