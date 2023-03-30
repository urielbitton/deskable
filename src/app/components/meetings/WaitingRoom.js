import { successToast } from "app/data/toastsTemplates"
import { useMeeting } from "app/hooks/meetingsHooks"
import { useUsers } from "app/hooks/userHooks"
import {
  addMeetingParticipantService,
  createJoinVideoMeetingService,
  joinVideoRoomService,
  removeMeetingParticipantService
} from "app/services/meetingsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicTime } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import MeetingStarted from "./MeetingStarted"
import './styles/WaitingRoom.css'

export default function WaitingRoom() {

  const { myUserID, setPageLoading, setToasts } = useContext(StoreContext)
  const meetingID = useParams().meetingID
  const meeting = useMeeting(meetingID)
  const videoRef = useRef(null)
  const [videoOn, setVideoOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [participants, setParticipants] = useState([])
  const [room, setRoom] = useState(null)
  const roomID = meeting?.roomID
  const participantsUsers = useUsers(meeting?.participants)
  const meetingTimeOver = meeting?.meetingEnd?.toDate() < new Date()
  const hasParticipants = participants.length > 0
  const meetingEnded = meetingTimeOver && !hasParticipants
  const meetingHasStarted = meeting?.meetingStart?.toDate() <= new Date()
  const canJoinMeeting = meetingHasStarted && !meetingTimeOver
  const navigate = useNavigate()

  const participantsRender = participantsUsers?.map((user, index) => {
    return <span
      key={index}
    >
      <Avatar
        src={user.photoURL}
        dimensions={25}
      />
      {user.firstName} {user.lastName}
      {index === participantsUsers.length - 1 ? "" : ","}
    </span>
  })

  const startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream
          setVideoOn(true)
        })
        .catch(err => console.log("Something went wrong!"))
    }
  }

  const stopVideo = () => {
    videoRef?.current?.srcObject?.getTracks()?.forEach(track => track?.stop())
    setVideoOn(false)
  }

  const startAudio = () => {
    setSoundOn(true)
  }

  const stopAudio = () => {
    setSoundOn(false)
  }

  const joinMeeting = () => {
    if (meetingEnded) return setToasts(successToast("This meeting has ended."))
    if(!canJoinMeeting) return setToasts(successToast("This meeting has not started yet."))
    createJoinVideoMeetingService(
      myUserID,
      roomID,
      setPageLoading,
      setToasts
    )
      .then((token) => {
        return joinVideoRoomService(token, videoOn, soundOn, setPageLoading)
      })
      .then((room) => {
        setMeetingStarted(true)
        setRoom(room)
      })
      .then(() => {
        addMeetingParticipantService(
          meeting?.orgID,
          meeting?.meetingID,
          myUserID
        )
      })
  }

  const copyRoomID = () => {
    navigator.clipboard.writeText(meeting?.roomID)
    setToasts(successToast("Room ID copied to clipboard"))
  }

  const participantConnected = participant => {
    setParticipants(prev => [...prev, participant])
  }

  const participantDisconnected = participant => {
    setParticipants(prevParticipants =>
      prevParticipants.filter(p => p !== participant)
    )
  }

  useEffect(() => {
    startVideo()
    return () => stopVideo()
  }, [])

  useEffect(() => {
    if (room) {
      room.on("participantConnected", participantConnected)
      room.on("participantDisconnected", participantDisconnected)
      room.participants.forEach(participantConnected)
    }
  }, [room])

  useEffect(() => {
    const disconnectParticipant = () => {
      room.disconnect()
      removeMeetingParticipantService(
        meeting?.orgID,
        meeting?.meetingID,
        myUserID
      )
    }
    window.onbeforeunload = disconnectParticipant
    window.onunload = disconnectParticipant
  }, [])

  return !meetingStarted ? (
    <div className="waiting-room-page">
      <AppButton
        label="Back to Meetings"
        buttonType="invertedBtn"
        leftIcon="fal fa-arrow-left"
        onClick={() => navigate('/meetings')}
        className="back-btn"
      />
      <div className="meeting-video">
        <div className="video-container">
          <video
            autoPlay
            ref={videoRef}
          />
          <div className="icons-bar">
            <IconContainer
              icon={videoOn ? "fas fa-video" : "fas fa-video-slash"}
              iconColor="var(--grayText)"
              iconSize={17}
              dimensions={40}
              bgColor="var(--inputBg)"
              onClick={!videoOn ? startVideo : stopVideo}
            />
            <IconContainer
              icon={soundOn ? "fas fa-microphone" : "fas fa-microphone-slash"}
              iconColor="var(--grayText)"
              iconSize={17}
              dimensions={40}
              bgColor="var(--inputBg)"
              onClick={!soundOn ? startAudio : stopAudio}
            />
          </div>
        </div>
      </div>
      <div className="meeting-details">
        { !meetingEnded && <h4>Ready to join?</h4> }
        <h5>Meeting: {meeting?.title}</h5>
        {
          participantsUsers?.length !== 0 ?
            <div className="participants">
              <h5>Participants</h5>
              {participantsRender}
            </div> :
            <span className="no-participants">No one has joined this meeting yet.</span>
        }
        <div className="schedule">
          <div>
            <span>{convertClassicDate(meeting?.meetingStart?.toDate())}</span>
            <span> - </span>
            <span>{convertClassicDate(meeting?.meetingEnd?.toDate())}</span>
          </div>
          <div>
            <span>{convertClassicTime(meeting?.meetingStart?.toDate())}</span>
            <span> - </span>
            <span>{convertClassicTime(meeting?.meetingEnd?.toDate())}</span>
          </div>
        </div>
        <h6
          className="room-id"
          title="Click to copy"
          onClick={() => copyRoomID()}
        >
          Room ID: {meeting?.roomID}
          <i className="fas fa-clone" />
        </h6>
        {
          meetingEnded ?
            <span className="meeting-ended">This meeting has ended.</span> :
            null
        }
        <AppButton
          label="Join Meeting"
          onClick={() => joinMeeting()}
          disabled={meetingEnded}
        />
      </div>
    </div>
  ) :
    <MeetingStarted
      room={room}
      participants={participants}
      videoOn={videoOn}
      setVideoOn={setVideoOn}
      soundOn={soundOn}
      setSoundOn={setSoundOn}
      setMeetingStarted={setMeetingStarted}
    />
}
