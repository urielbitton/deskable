import { convertClassicDate } from "app/utils/dateUtils"
import { convertBytesToKbMbGb, downloadUsingFetch, fileTypeConverter } from "app/utils/fileUtils"
import { truncateTextWithExt } from "app/utils/generalUtils"
import React from 'react'
import IconContainer from "../ui/IconContainer"
import './styles/FileAttachment.css'

export default function FileAttachment(props) {

  const { name, size, type, dateUploaded, url } = props.file
  const { onClick, onDeleteFile } = props
  const isPhoto = type.includes('image')
  const isVideo = type.includes('video')
  const isMedia = isPhoto || isVideo

  const handleDeleteFile = (e) => {
    e.stopPropagation()
    const confirm = window.confirm(`Are you sure you want to delete this file?`)
    if (!confirm) return
    onDeleteFile(props.file)
  }

  return (
    <div
      className={`attachment-item ${isMedia ? 'media' : ''}`}
      onClick={() => onClick(props.file)}
    >
      <div className="top">
        {
          !isPhoto && !isVideo ?
            <IconContainer
              icon={fileTypeConverter(type).icon}
              bgColor={fileTypeConverter(type).color}
              iconColor="#fff"
              dimensions={50}
              iconSize={24}
              round={false}
            /> :
            isPhoto ?
              <img src={props.file.url} alt={name} /> :
              <video src={props.file.url} />
        }
      </div>
      <div className="bottom">
        <h6 title={name}>{truncateTextWithExt(name, 18)}</h6>
        <small>
          {convertBytesToKbMbGb(size, 0)}
          {dateUploaded && <>&nbsp;&#x2022;&nbsp;{convertClassicDate(dateUploaded?.toDate())}</>}
        </small>
      </div>
      <div className="cover">
        <div className="actions">
          <IconContainer
            icon="fas fa-cloud-download-alt"
            iconColor="var(--grayText)"
            dimensions={23}
            iconSize={13}
            round={false}
            onClick={(e) => {
              e.stopPropagation()
              downloadUsingFetch(url, name)
            }}
          />
          <IconContainer
            icon="far fa-times"
            iconColor="var(--grayText)"
            dimensions={23}
            iconSize={15}
            round={false}
            onClick={(e) => handleDeleteFile(e)}
          />
        </div>
      </div>
    </div>
  )
}
