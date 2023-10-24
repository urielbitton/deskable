import { useMeeting } from "app/hooks/meetingsHooks"
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import MeetingSidebar from "./MeetingSidebar"
import MeetingWindow from "./MeetingWindow"
import { useIsFullScreen } from "app/hooks/generalHooks"
import BackgroundEffectsBar from "./BackgroundEffectsBar"

export default function MeetingStarted(props) {

  const { videoOn, soundOn, room, setVideoOn,
    setSoundOn, setMeetingStarted, participants,
    stopVideo } = props
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false)
  const meetingID = useParams().meetingID
  const meeting = useMeeting(meetingID)
  const isFullscreen = useIsFullScreen()

  useEffect(() => {
    return () => {
      stopVideo()
      setVideoOn(false)
    }
  }, [])

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
        setShowBackgroundEffects={setShowBackgroundEffects}
      />
      <MeetingSidebar
        meeting={meeting}
      />
      <BackgroundEffectsBar
        showBar={showBackgroundEffects}
        onClose={() => setShowBackgroundEffects(false)}
      />
    </div>
  )
}
