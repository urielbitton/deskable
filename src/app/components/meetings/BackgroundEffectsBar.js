import React, { useRef, useState } from 'react'
import './styles/BackgroundEffectsBar.css'
import IconContainer from "../ui/IconContainer"
import { getUserMediaDevices } from "app/services/meetingsServices"
import { useEffect } from "react"
import { GaussianBlurBackgroundProcessor } from '@twilio/video-processors'
import Twilio from "twilio-video"

export default function BackgroundEffectsBar(props) {

  const { showBar, onClose } = props
  const videoRef = useRef(null)
  const [activeEffect, setActiveEffect] = useState('none')

  const startVideo = () => {
    getUserMediaDevices()
      .then((stream) => {
        videoRef.current.srcObject = stream
      })
  }

  const createVideoTrack = async () => {
    const videoTrack = await Twilio.createLocalVideoTrack({
      width: 640,
      height: 480,
      frameRate: 24
    })
    videoTrack.attach(videoRef.current)
    const bg = new GaussianBlurBackgroundProcessor({
      assetsPath: '/',
      maskBlurRadius: 10,
      blurFilterRadius: 5,
    })
    await bg.loadModel()
    videoTrack.addProcessor(bg)
  }

  useEffect(() => {
    if (showBar) {
      startVideo()
    }
  }, [showBar])

  useEffect(() => {
    createVideoTrack()
  }, [activeEffect])

  return (
    <div className={`background-effects-bar ${showBar ? 'show' : ''}`}>
      <div className="titles">
        <h5>Background Effects</h5>
        <IconContainer
          icon="fal fa-times"
          iconColor="var(--darkGrayText)"
          bgColor="var(--darkInputBg)"
          iconSize={19}
          dimensions={30}
          round={false}
          onClick={onClose}
        />
      </div>
      <div className="video-effects-container">
        <video
          ref={videoRef}
          autoPlay
          muted
        />
      </div>
      <div className="effects-column">
        <div className="effects-row blur-row">
          <div
            className={`effects-item ${activeEffect === 'none' ? 'active' : ''}`}
            title="No Effects"
            onClick={() => setActiveEffect('none')}
          >
            <i className="far fa-ban" />
          </div>
          <div
            className={`effects-item ${activeEffect === 'small-blur' ? 'active' : ''}`}
            title="Small blur background"
            onClick={() => setActiveEffect('small-blur')}
          >
            <i className="far fa-tint" />
          </div>
          <div
            className={`effects-item ${activeEffect === 'large-blur' ? 'active' : ''}`}
            title="Large blur background"
            onClick={() => setActiveEffect('large-blur')}
          >
            <i className="fas fa-tint" />
          </div>
        </div>
      </div>
    </div>
  )
}
