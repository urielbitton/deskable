import { convertClassicDate } from "app/utils/dateUtils"
import { convertBytesToKbMbGb, fileTypeConverter } from "app/utils/fileUtils"
import { truncateText } from "app/utils/generalUtils"
import React from 'react'
import IconContainer from "../ui/IconContainer"
import './styles/AttachmentItem.css'

export default function TaskAttachment(props) {

  const { name, size, type, dateUploaded } = props.file
  const isPhoto = type.includes('image')
  const isVideo = type.includes('video')

  return (
    <div className="attachment-item">
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
        <div className="cover">
          <IconContainer
            icon="fas fa-cloud-download-alt"
            iconColor="var(--grayText)"
            dimensions={25}
            iconSize={13}
            round={false}
          />
          <IconContainer
            icon="far fa-times"
            iconColor="var(--grayText)"
            dimensions={25}
            iconSize={15}
            round={false}
          />
        </div>
      </div>
      <div className="bottom">
        <h6>{truncateText(name, 40)}</h6>
        <small>
          {convertBytesToKbMbGb(size, 0)} &#x2022;&nbsp;
          {convertClassicDate(dateUploaded?.toDate())}
        </small>
      </div>
    </div>
  )
}
