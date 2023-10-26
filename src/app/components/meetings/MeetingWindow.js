import {
  removeMeetingParticipantService,
  shareScreenService, stopSharingScreenService,
  switchMeetingInactiveService,
  toggleRaiseHandService
} from "app/services/meetingsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import DropdownIcon from "../ui/DropDownIcon"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import VolumeSlider from "../ui/VolumeSlider"
import Participant from "./Participant"
import './styles/MeetingWindow.css'
import { toggleFullScreen } from "app/utils/generalUtils"

export default function MeetingWindow(props) {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const { meeting, room, videoOn, soundOn,
    setVideoOn, setSoundOn, setMeetingStarted,
    participants, setShowBackgroundEffects } = props
  const [soundVolume, setSoundVolume] = useState(80)
  const [showOptions, setShowOptions] = useState(false)
  const [dominantSpeaker, setDominantSpeaker] = useState(null)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [remoteScreenSharer, setRemoteScreenSharer] = useState(null)
  const [shareScreenTrack, setShareScreenTrack] = useState(null)
  const meetingTimeOver = meeting?.meetingEnd?.toDate() < new Date()
  const isRaisingHand = meeting?.raisedHands?.includes(myUserID)

  const participantsList = participants?.map((participant, index) => {
    return <Participant
      key={index}
      participant={participant}
      dominantSpeaker={dominantSpeaker}
      setRemoteScreenSharer={setRemoteScreenSharer}
      meeting={meeting}
    />
  })

  const ActionIcon = ({ name, className = '', title, icon, onClick }) => {
    return <div
      className={`action-icon ${name} ${className}`}
      title={title}
      onClick={onClick}
    >
      <i
        className={icon}
      />
    </div>
  }

  const forceLeaveRoom = () => {
    setMeetingStarted(false)
    if (!room) return
    room.disconnect()
    room.localParticipant.tracks.forEach(track => {
      track.stop()
      track.detach()
    })
    removeMeetingParticipantService(
      meeting?.orgID,
      meeting?.meetingID,
      myUserID
    )
      .then(() => {
        if (participants.length === 0 && meetingTimeOver) {
          switchMeetingInactiveService(
            meeting?.orgID,
            meeting?.meetingID
          )
        }
      })
  }

  const leaveRoom = () => {
    const confirm = window.confirm("Are you sure you want to leave the meeting?")
    if (!confirm) return
    forceLeaveRoom()
  }

  const toggleVideo = (value) => {
    setVideoOn(prev => !prev)
    room.localParticipant.videoTracks.forEach(publication => {
      if (value) {
        publication.track.stop()
      }
      else {
        publication.track.restart()
      }
    })
  }

  const toggleAudio = (value) => {
    setSoundOn(prev => !prev)
    room.localParticipant.audioTracks.forEach(publication => {
      if (value) {
        publication.track.disable()
      }
      else {
        publication.track.enable()
      }
    })
  }

  const toggleShareScreen = () => {
    if (!isScreenSharing) {
      setPageLoading(true)
      shareScreenService(room, setShareScreenTrack, setIsScreenSharing)
        .then(() => {
          setPageLoading(false)
        })
        .catch(() => setPageLoading(false))
    }
    else {
      stopSharingScreenService(room, shareScreenTrack, setShareScreenTrack, setIsScreenSharing)
      setRemoteScreenSharer(null)
      setShareScreenTrack(null)
    }
  }

  const toggleRaiseHand = () => {
    toggleRaiseHandService(
      meeting.orgID,
      meeting.meetingID,
      myUserID,
      isRaisingHand
    )
  }

  useEffect(() => {
    if (room) {
      room.on('dominantSpeakerChanged', participant => {
        if (!participant) {
          setDominantSpeaker(null)
        }
        else {
          setDominantSpeaker(participant)
        }
      })
    }
  }, [room, participants])

  useEffect(() => {
    const disconnectParticipant = () => {
      if (room) {
        room.disconnect()
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
  })

  return (
    <div className="meeting-window">
      <div className="titles">
        <h4>{meeting?.title}</h4>
        <MultipleUsersAvatars
          userIDs={meeting?.participants}
          maxAvatars={7}
          avatarDimensions={28}
        />
      </div>
      <div className="toolbar">
        <div className="left side">
          <div className="record-div">
            <i className="fas fa-record-vinyl" />
            Recording <b>00:00:00</b>
          </div>
        </div>
        <div className="right side">
          <AppButton
            label="Invite people"
            buttonType="invertedBtn"
            leftIcon="fas fa-user-plus"
          />
        </div>
      </div>
      <div className="video-container"> 
        { //main video container
          !remoteScreenSharer?.value ?
            // Local participant view of their own screenshare
            <Participant
              participant={room?.localParticipant}
              isLocal
              screenTrack={shareScreenTrack}
              meeting={meeting}
            /> :
            // Remote participant view of the screen sharer
            <Participant
              participant={remoteScreenSharer?.participant}
              screenShareWindow
              meeting={meeting}
            />
        }
        <div className="participants-list">
          {participantsList}
          {
            shareScreenTrack &&
            <Participant
              participant={room?.localParticipant}
              screenShareWindow
              meeting={meeting}
            />
          }
          {
            remoteScreenSharer?.value &&
            <Participant
              participant={room?.localParticipant}
              isTempLocal
              isLocal
              meeting={meeting}
            />
          }
        </div>
      </div>
      <div className="video-actions">
        <div className="left side">
        </div>
        <div className="center side">
          <ActionIcon
            name="video"
            title={videoOn ? "Stop video" : "Start video"}
            icon={videoOn ? "fas fa-video" : "far fa-video-slash"}
            onClick={() => toggleVideo(videoOn)}
            className={!videoOn ? "inactive" : ""}
          />
          <ActionIcon
            name="sound"
            title={soundOn ? "Mute" : "Unmute"}
            icon={soundOn ? "fas fa-microphone" : "fas fa-microphone-slash"}
            onClick={() => toggleAudio(soundOn)}
            className={!soundOn ? "inactive" : ""}
          />
          <ActionIcon
            name="present"
            title="Share screen"
            icon={isScreenSharing ? "far fa-tablet-android" : "fas fa-tablet-android"}
            onClick={toggleShareScreen}
            className={isScreenSharing ? "active" : ""}
          />
          <ActionIcon
            name="raise-hand"
            title="Raise hand"
            icon="fas fa-hand-paper"
            onClick={toggleRaiseHand}
            className={isRaisingHand ? "active" : ""}
          />
          <ActionIcon
            name="fullscreen"
            title="Fullscreen"
            icon="fas fa-expand"
            onClick={() => toggleFullScreen()}
          />
          <DropdownIcon
            icon="fas fa-ellipsis-v"
            iconSize={15}
            dimensions={40}
            iconColor="var(--grayText)"
            showMenu={showOptions}
            setShowMenu={setShowOptions}
            onClick={() => setShowOptions(prev => !prev)}
            dropdownPosition="place-right-top"
            items={[
              { label: 'Background Effects', icon: 'fas fa-sparkles', onClick: () => setShowBackgroundEffects(true) },
              { label: 'Report a problem', icon: 'fas fa-bullhorn', onClick: () => console.log('') },
              { label: 'Settings', icon: 'fas fa-cog', onClick: () => console.log('') }
            ]}
          />
        </div>
        <div className="right side">
          <ActionIcon
            name="leave"
            title="Leave meeting"
            icon="fas fa-sign-out-alt"
            onClick={leaveRoom}
          />
        </div>
      </div>
    </div>
  )
}
