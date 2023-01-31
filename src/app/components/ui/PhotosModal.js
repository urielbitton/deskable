import { convertClassicDate } from "app/utils/dateUtils"
import { convertBytesToKbMbGb } from "app/utils/fileUtils"
import React, { useState } from 'react'
import { useSearchParams } from "react-router-dom"
import AppPortal from "./AppPortal"
import IconContainer from "./IconContainer"
import './styles/PhotosModal.css'

export default function PhotosModal(props) {

  const { showModal, portalClassName, photos, onClose } = props
  const [showInfo, setShowInfo] = useState({ show: false, file: null })
  const [searchParams, setSearchParams] = useSearchParams()
  const photoIndex = searchParams.get("index") || 0
  const [slideIndex, setSlideIndex] = useState(+photoIndex)
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
          onClick={onClose}
        />
        <div className="photos-window">
          <div className="top-bar">
            <IconContainer
              icon="fas fa-cloud-download-alt"
              onClick={() => console.log("download")}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
            <IconContainer
              icon="far fa-search-plus"
              onClick={() => console.log("zoom in")}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
            <IconContainer
              icon="far fa-search-minus"
              onClick={() => console.log("zoom out")}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
            <IconContainer
              icon="fas fa-info-circle"
              onClick={() => setShowInfo({ show: true, file: photos[slideIndex] })}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
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
        {
          <div
            className={`photo-info-container ${showInfo.show ? 'show' : ''}`}
            onClick={() => setShowInfo({ show: false, file: null })}
          >
            <div
              className="photo-info"
              onClick={e => e.stopPropagation()}
            >
              <div className="titles">
                <h4>Photo Details</h4>
                <i
                  className="fal fa-times"
                  onClick={() => setShowInfo({ show: false, file: null })}
                />
              </div>
              <div className="content">
                <div className="row">
                  <h5>File Name</h5>
                  <h6>{showInfo.file?.name}</h6>
                </div>
                <div className="row">
                  <h5>File Type</h5>
                  <h6>{showInfo.file?.type}</h6>
                </div>
                <div className="row">
                  <h5>File Size</h5>
                  <h6>{convertBytesToKbMbGb(showInfo.file?.size)}</h6>
                </div>
                <div className="row">
                  <h5>Date Uploaded</h5>
                  <h6>{convertClassicDate(showInfo.file?.dateCreated?.toDate())}</h6>
                </div>
                <div className="row">
                  <h5>File Description</h5>
                  <h6>{showInfo.file?.description}</h6>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </AppPortal>
  )
}
