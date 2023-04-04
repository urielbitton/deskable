import useUser from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import IconContainer from "../ui/IconContainer"

export default function Participant(prop) {

  const { myUserID } = useContext(StoreContext)
  const { participant, dominantSpeaker, isLocal, screenTrack,
    screenShareWindow, setRemoteScreenSharer, isTempLocal,
    meeting } = prop
  const participantClass = participant?.identity === myUserID ? "my-participant" : "participants"
  const [videoTracks, setVideoTracks] = useState([])
  const [audioTracks, setAudioTracks] = useState([])
  const [dataTracks, setDataTracks] = useState([])
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const participantUser = useUser(participant?.identity)
  const isDominantSpeaker = participant?.identity === dominantSpeaker?.identity
  const hasRaisedHand = meeting?.raisedHands?.includes(participant?.identity)

  const trackPubsToTracks = trackMap => Array.from(trackMap.values())
    .map(publication => publication.track)
    .filter(track => track !== null)

  const trackSubscribed = track => {
    if (track.kind === 'video') {
      setVideoTracks(videoTracks => [...videoTracks, track])
      setIsVideoMuted(track.isMuted)
    }
    if(track.name === 'myscreenshare') {
      setRemoteScreenSharer({participant, value: true})
      setVideoTracks(videoTracks => [...videoTracks, track])
    }
    if(track.kind === 'audio') {
      setAudioTracks(audioTracks => [...audioTracks, track])
      setIsAudioMuted(track.isMuted)
    }
  }
  
  const trackUnsubscribed = track => {
    if (track.kind === 'video') {
      setVideoTracks(videoTracks => videoTracks.filter(v => v !== track))
      setIsVideoMuted(track.isMuted)
    }
    if(track.name === 'myscreenshare') {
      setRemoteScreenSharer(null)
      setVideoTracks(videoTracks => videoTracks.filter(v => v !== track))
    }
    if(track.kind === 'audio') {
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
  }, [videoTracks])

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
  }, [audioTracks])

  useEffect(() => {
    const videoTrack = videoTracks[0]
    if (screenTrack) {
      screenTrack.attach(videoRef.current)
      screenTrack.on('enabled', () => {

      })
      screenTrack.on('disabled', () => {

      })
      return () => {
        screenTrack.detach()
      }
    }
    else {
      if(videoTrack) {
        videoTrack.attach(videoRef.current)
      }
    } 
  }, [screenTrack, participant]) 

  return (
    <div
      className={`participant ${participantClass} ${screenShareWindow ? "screenshare-window" : ""} ${isTempLocal ? 'is-local' : ''}`}
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
        isTempLocal &&
        <h6>You</h6>
      }
      {
        !isLocal &&
        <>
          <h6>
            {
              participant?.identity === myUserID ? "You" :
              participantUser?.firstName
            }
          </h6>
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
                bgColor="var(--red)"
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
            {
              screenShareWindow &&
              <IconContainer
                icon="fas fa-tablet"
                iconColor="#fff"  
                iconSize={12}
                dimensions={27}
                bgColor="var(--primary)"
              />
            }
            {
              hasRaisedHand &&
              <IconContainer
                icon="fas fa-hand-paper"
                iconColor="#fff"
                iconSize={12}
                dimensions={27}
                bgColor="var(--yellow)"
              />
            }
          </div>
        </>
      }
    </div>
  )
}
