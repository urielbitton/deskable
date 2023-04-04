import { useMeeting } from "app/hooks/meetingsHooks"
import React, {  } from 'react'
import { useParams } from "react-router-dom"
import MeetingSidebar from "./MeetingSidebar"
import MeetingWindow from "./MeetingWindow"
import { useIsFullScreen } from "app/hooks/generalHooks"

export default function MeetingStarted(props) {

  const { videoOn, soundOn, room, setVideoOn,
    setSoundOn, setMeetingStarted, participants } = props
  const meetingID = useParams().meetingID
  const meeting = useMeeting(meetingID)
  const isFullscreen = useIsFullScreen()

  return (
    <div className={`meeting-started-page ${isFullscreen ? 'fullscreen' : ''}`}>
      <MeetingWindow
        meeting={meeting}
        room={room}
        participants={participants}
        videoOn={videoOn}
        setVideoOn={setVideoOn}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        setMeetingStarted={setMeetingStarted}
      />
      <MeetingSidebar
        meeting={meeting}
      />
    </div>
  )
}
