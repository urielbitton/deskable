import useUser from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import IconContainer from "../ui/IconContainer"

export default function Participant(prop) {

  const { myUserID } = useContext(StoreContext)
  const { participant, dominantSpeaker, isLocal, screenTrack } = prop
  const participantClass = participant?.identity === myUserID ? "my-participant" : "participants"
  const [videoTracks, setVideoTracks] = useState([])
  const [audioTracks, setAudioTracks] = useState([])
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const participantUser = useUser(participant?.identity)
  const isDominantSpeaker = participant?.identity === dominantSpeaker?.identity

  const trackPubsToTracks = trackMap => Array.from(trackMap.values())
    .map(publication => publication.track)
    .filter(track => track !== null)

  const trackSubscribed = track => {
    if (track.kind === 'video') {
      setVideoTracks(videoTracks => [...videoTracks, track])
      setIsVideoMuted(track.isMuted)
    }
    else {
      setAudioTracks(audioTracks => [...audioTracks, track])
      setIsAudioMuted(track.isMuted)
    }
  }
  const trackUnsubscribed = track => {
    if (track.kind === 'video') {
      setVideoTracks(videoTracks => videoTracks.filter(v => v !== track))
      setIsVideoMuted(track.isMuted)
    }
    else {
      setAudioTracks(audioTracks => audioTracks.filter(a => a !== track))
      setIsAudioMuted(track.isMuted)
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
      videoTrack.on('enabled', () => {
        setIsVideoMuted(false)
      })
      videoTrack.on('disabled', () => {
        setIsVideoMuted(true)
      })
      videoTrack.attach(videoRef.current)
      return () => {
        videoTrack.detach()
      }
    } 
  },[videoTracks])
  
  useEffect(() => {
    const audioTrack = audioTracks[0]
    if (audioTrack) {
      audioTrack.on('enabled', () => {
        setIsAudioMuted(false)
      })
      audioTrack.on('disabled', () => {
        setIsAudioMuted(true)
      })
      audioTrack.attach(audioRef.current)
      return () => {
        audioTrack.detach()
      }
    } 
  },[audioTracks])

  useEffect(() => {
    const videoTrack = videoTracks[0]
    if (screenTrack) {
      screenTrack.attach(videoRef.current)
      screenTrack.on('enabled', () => {
        videoTrack?.detach()
      })
      screenTrack.on('disabled', () => {
        videoTrack?.attach(videoRef.current)
      })
      return () => {
        screenTrack.detach()
      }
    }
  }, [screenTrack])

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
      {
        !isLocal &&
        <>
          <h6>{participantUser?.firstName}</h6>
          <div className="icons-row">
            {
              isVideoMuted &&
              <IconContainer
                icon="fas fa-video-slash"
                iconColor="#fff"
                iconSize={12}
                dimensions={27}
                bgColor="var(--orange)"
              />
            }
            {
              isAudioMuted &&
              <IconContainer
                icon="fas fa-microphone-slash"
                iconColor="#fff"
                iconSize={12}
                dimensions={27}
                bgColor="var(--yellow)"
              />
            }
            {
              isDominantSpeaker &&
              <IconContainer
                icon="fas fa-waveform"
                iconColor="#fff"
                iconSize={12}
                dimensions={27}
                bgColor="var(--blue)"
              />
            }
          </div>
        </>
      }
    </div>
  )
}
