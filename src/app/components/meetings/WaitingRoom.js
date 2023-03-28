import { successToast } from "app/data/toastsTemplates"
import { useMeeting } from "app/hooks/meetingsHooks"
import { useUsers } from "app/hooks/userHooks"
import {
  addMeetingParticipantService,
  createJoinVideoMeetingService,
  handleConnectedParticipant,
  handleDisconnectedParticipant,
  joinVideoRoomService
} from "app/services/meetingsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicTime } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
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
  const [videoOn, setVideoOn] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [room, setRoom] = useState(null)
  const roomID = meeting?.roomID
  const participantsUsers = useUsers(meeting?.participants)

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

  useEffect(() => {
    // startVideo()
    // return () => stopVideo()
  }, [])

  useEffect(() => {
    if (room) {
      handleConnectedParticipant(room.localParticipant, myUserID)
      room.participants.forEach(handleConnectedParticipant)
      room.on("participantConnected", handleConnectedParticipant)
      room.on("participantDisconnected", handleDisconnectedParticipant)
    }
  }, [room])

  useEffect(() => {
    window.addEventListener("pagehide", () => room.disconnect())
    window.addEventListener("beforeunload", () => room.disconnect())
    return () => {
      window.removeEventListener("pagehide", () => room.disconnect())
      window.removeEventListener("beforeunload", () => room.disconnect())
    }
  }, [])

  return !meetingStarted ? (
    <div className="waiting-room-page">
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
        <h4>Ready to join?</h4>
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
        <AppButton
          label="Join Meeting"
          onClick={() => joinMeeting()}
        />
      </div>
    </div>
  ) :
    <MeetingStarted
      room={room}
      videoOn={videoOn}
      setVideoOn={setVideoOn}
      soundOn={soundOn}
      setSoundOn={setSoundOn}
      setMeetingStarted={setMeetingStarted}
    />
}
