import { successToast } from "app/data/toastsTemplates"
import { useMeeting } from "app/hooks/meetingsHooks"
import { useOrganization } from "app/hooks/organizationHooks"
import { useUsers } from "app/hooks/userHooks"
import {
  addMeetingParticipantService,
  closeMeetingRoomService,
  createJoinVideoMeetingService,
  getUserMediaDevices,
  joinVideoRoomService,
  removeMeetingParticipantService,
  stopVideoCameraService
} from "app/services/meetingsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicTime } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import MeetingStarted from "./MeetingStarted"
import './styles/WaitingRoom.css'
import AppModal from "../ui/AppModal"

export default function WaitingRoom() {

  const { myUserID, myOrgID, setPageLoading, setToasts } = useContext(StoreContext)
  const meetingID = useParams().meetingID
  const meeting = useMeeting(meetingID)
  const videoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const [videoOn, setVideoOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [participants, setParticipants] = useState([])
  const [room, setRoom] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const roomID = meeting?.roomID
  const participantsUsers = useUsers(meeting?.participants)
  const meetingTimeOver = meeting?.meetingEnd?.toDate() < new Date()
  const hasParticipants = participants.length > 0
  const meetingEnded = meetingTimeOver && !hasParticipants
  const meetingHasStarted = meeting?.meetingStart?.toDate() <= new Date()
  const navigate = useNavigate()
  const org = useOrganization(meeting?.orgID)
  const canCloseRoom = meeting?.organizerID === myUserID

  const participantsRender = participantsUsers?.map((user, index) => {
    return <span
      key={index}
    >
      <Avatar
        src={user.photoURL}
        dimensions={25}
      />
      {user.firstName} {user.lastName}
    </span>
  })

  const startVideo = () => {
    getUserMediaDevices()
      .then((stream) => {
        if(!stream) return
        mediaStreamRef.current = stream
        videoRef.current.srcObject = stream
        setVideoOn(true)
      })
  }

  const stopVideo = () => {
    stopVideoCameraService(mediaStreamRef.current)
    setVideoOn(false)
  }

  const startAudio = () => {
    setSoundOn(true)
  }

  const stopAudio = () => {
    setSoundOn(false)
  }

  const joinMeeting = () => {
    return createJoinVideoMeetingService(
      myUserID,
      org.accountType || 'basic',
      roomID,
      meeting.roomType || "group",
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

  const closeRoom = () => {
    if (!canCloseRoom) return
    const confirm = window.confirm("Are you sure you want to close this room? You won't be able to re-open it and all chat messages will be lost.")
    if (!confirm) return
    stopVideo()
    closeMeetingRoomService(myOrgID, meetingID, setToasts, setPageLoading)
      .then(() => {
        navigate('/meetings')
      })
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
      if (room) {
        room && room.disconnect()
        room.localParticipant.tracks.forEach(track => {
          track.stop()
          track.detach()
        })
      }
      removeMeetingParticipantService(
        meeting?.orgID,
        meeting?.meetingID,
        myUserID
      )
    }
    window.onbeforeunload = disconnectParticipant
    window.onunload = disconnectParticipant
  }, [])

  return (!meetingStarted && meeting) ? (
    <div className="waiting-room-page">
      <div className="meeting-video">
        <div className="toolbar">
          <AppButton
            label="Back to Meetings"
            buttonType="invertedBtn"
            leftIcon="fal fa-arrow-left"
            onClick={() => navigate('/meetings')}
          />
          <AppButton
            label="Room Settings"
            buttonType="invertedBtn"
            leftIcon="fal fa-cog"
            onClick={() => setShowSettingsModal(true)}
          />
        </div>
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
        {!meetingEnded && <h4>Ready to join?</h4>}
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
            !meetingHasStarted ?
              <span>This meeting has not started yet.</span> :
              null
        }
        <AppButton
          label="Join Meeting"
          onClick={() => joinMeeting()}
        />
      </div>
      <AppModal
        showModal={showSettingsModal}
        setShowModal={setShowSettingsModal}
        label="Room Settings"
        portalClassName="room-settings-modal"
        onClose={() => setShowSettingsModal(false)}
        actions={
          <AppButton
            label="Done"
            onClick={() => setShowSettingsModal(false)}
          />
        }
      >
        <div className="room-settings">
          <div className="settings-row">
            <h5>Close Room</h5>
            <AppButton
              label="Close Room"
              onClick={closeRoom}
              buttonType="redBtn"
              disabled={!canCloseRoom}
              title={!canCloseRoom && "You can only close this room if you are the meeting organizer."}
            />
          </div>
        </div>
      </AppModal>
    </div>
  ) :
    meeting ?
      <MeetingStarted
        room={room}
        participants={participants}
        videoOn={videoOn}
        setVideoOn={setVideoOn}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        setMeetingStarted={setMeetingStarted}
        stopVideo={stopVideo}
      /> :
      <p style={{ padding: 10 }}>This meeting does not exist or has been deleted.&nbsp;
        <Link to="/meetings" style={{textDecoration: 'underline'}}>Back to Meetings.</Link>
      </p>
}
