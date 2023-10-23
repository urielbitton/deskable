import React from 'react'
import IconContainer from "./IconContainer"
import { convertBytesToKbMbGb, fileTypeConverter } from "app/utils/fileUtils"
import { truncateTextWithExt } from "app/utils/generalUtils"
import './styles/UploadFileItem.css'

export default function UploadFileItem(props) {

  const { onClick, file, src, onCloseClick } = props
  const isPhoto = file?.type?.includes("image")
  const isVideo = file?.type?.includes("video")
  const isMedia = isPhoto || isVideo

  return (
    <div
      className={`upload-file-item ${isMedia ? "media" : ""}`}
      onClick={onClick}
    >
      <div className="left-side">
        {
          !isPhoto && !isVideo ?
            <IconContainer
              icon={fileTypeConverter(file?.type).icon}
              bgColor={fileTypeConverter(file?.type).color}
              iconColor="#fff"
              dimensions={32}
              iconSize={18}
              round={false}
            /> :
            isPhoto ?
              <img src={src} /> :
              <video src={src} />
        }
      </div>
      {
        !isMedia &&
        <div className="right-side">
          <h6 title={file?.name}>{truncateTextWithExt(file?.name, 18)}</h6>
          <small>{convertBytesToKbMbGb(file?.size, 0)}</small>
        </div>
      }
      <div 
        className="close"
        onClick={onCloseClick}
      >
        <i className="fal fa-times" />
      </div>
    </div>
  )
}
