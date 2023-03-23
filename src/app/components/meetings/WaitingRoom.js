import { useMeeting } from "app/hooks/meetingsHooks"
import {
  createJoinVideoMeetingService,
  handleConnectedParticipant,
  handleDisconnectedParticipant,
  joinVideoRoomService
} from "app/services/meetingsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
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
  }

  useEffect(() => {
    startVideo()
    return () => stopVideo()
  }, [])

  useEffect(() => {
    if(room) {
      handleConnectedParticipant(room.localParticipant)
      room.participants.forEach(handleConnectedParticipant)
      room.on("participantConnected", handleConnectedParticipant)
      room.on("participantDisconnected", handleDisconnectedParticipant)
    }
  },[room])

  useEffect(() => {
    window.addEventListener("pagehide", () => room.disconnect())
    window.addEventListener("beforeunload", () => room.disconnect())
    return () => {
      window.removeEventListener("pagehide", () => room.disconnect())
      window.removeEventListener("beforeunload", () => room.disconnect())
    }
  },[])

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
      soundOn={soundOn}
      setMeetingStarted={setMeetingStarted}
    />
}
