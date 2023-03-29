import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'

export default function Participant(prop) {

  const { myUserID } = useContext(StoreContext)
  const { room, participant } = prop
  const participantClass = participant?.identity === myUserID ? "my-participant" : "participants"
  const [videoTracks, setVideoTracks] = useState([])
  const [audioTracks, setAudioTracks] = useState([])
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const trackPubsToTracks = trackMap => Array.from(trackMap.values())
    .map(publication => publication.track)
    .filter(track => track !== null)

  const trackSubscribed = track => {
    if (track.kind === 'video') {
      setVideoTracks(videoTracks => [...videoTracks, track])
    }
    else {
      setAudioTracks(audioTracks => [...audioTracks, track])
    }
  }
  const trackUnsubscribed = track => {
    if (track.kind === 'video') {
      setVideoTracks(videoTracks => videoTracks.filter(v => v !== track))
    }
    else {
      setAudioTracks(audioTracks => audioTracks.filter(a => a !== track))
    }
  }

  useEffect(() => {
    setVideoTracks(trackPubsToTracks(participant.videoTracks))
    setAudioTracks(trackPubsToTracks(participant.audioTracks))
    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackUnsubscribed', trackUnsubscribed)
    return () => {
      setVideoTracks([])
      setAudioTracks([])
      participant.removeAllListeners()
    }
  }, [participant])

  useEffect(() => {
    const videoTrack = videoTracks[0]
    if (videoTrack) {
      videoTrack.attach(videoRef.current)
      return () => {
        videoTrack.detach()
      }
    }
  }, [videoTracks])

  useEffect(() => {
    const audioTrack = audioTracks[0]
    if (audioTrack) {
      audioTrack.attach(audioRef.current)
      return () => {
        audioTrack.detach()
      }
    }
  }, [audioTracks])

  return (
    <div
      className={`participant ${participantClass}`}
      key={participant?.identity}
      id={participant?.identity}
    >
      <video
        ref={videoRef}
        autoPlay
      />
      <audio
        ref={audioRef}
        autoPlay
      />
    </div>
  )
}
