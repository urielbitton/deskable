import { useMeeting } from "app/hooks/meetingsHooks"
import React from 'react'
import { useParams } from "react-router-dom"
import MeetingSidebar from "./MeetingSidebar"
import MeetingWindow from "./MeetingWindow"
import './styles/MeetingStarted.css'

export default function MeetingStarted(props) {

  const { videoOn, soundOn, room, setMeetingStarted } = props
  const meetingID = useParams().meetingID
  const meeting = useMeeting(meetingID)

  return (
    <div className="meeting-started-page">
      <MeetingWindow 
        meeting={meeting}
        room={room} 
        videoOn={videoOn}
        soundOn={soundOn}
        setMeetingStarted={setMeetingStarted}
      />
      <MeetingSidebar 
        meeting={meeting} 
      />
    </div>
  )
}
