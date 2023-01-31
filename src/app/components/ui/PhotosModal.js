import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import AppPortal from "./AppPortal"
import './styles/PhotosModal.css'

export default function PhotosModal(props) {

  const { showModal, portalClassName, photos } = props
  const [slideIndex, setSlideIndex] = useState(0)
  const navigate = useNavigate()
  const photosNum = photos?.length

  const photosList = photos
    ?.slice(slideIndex, slideIndex + 1)
    .map((photo, index) => {
      return <img
        key={index}
        src={photo.url}
        alt={photo.name}
      />
    })

  return (
    <AppPortal
      showPortal={showModal}
      className={portalClassName}
    >
      <div
        className={`photos-modal-container ${showModal ? "show" : ""}`}
      >
        <i
          className="fal fa-times close-icon"
          onClick={() => navigate(-1)}
        />
        <div className="photos-window">
          <div className="top-bar">
            <i className="fas fa-cloud-download-alt" />
          </div>
          {photosList}
        </div>
        {
          slideIndex > 0 &&
          <div
            className="photos-nav-left photos-nav-bar"
            onClick={() => slideIndex > 0 && setSlideIndex(slideIndex - 1)}
          >
            <i className="fal fa-chevron-left" />
          </div>
        }
        {
          slideIndex < photosNum - 1 &&
          <div
            className="photos-nav-right photos-nav-bar"
            onClick={() => slideIndex < photosNum - 1 && setSlideIndex(slideIndex + 1)}
          >
            <i className="fal fa-chevron-right" />
          </div>
        }
      </div>
    </AppPortal>
  )
}
