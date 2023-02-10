import { deleteOrgProjectTaskFilesService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { convertBytesToKbMbGb, downloadUsingFetch, fileTypeConverter } from "app/utils/fileUtils"
import { truncateTextWithExt } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import IconContainer from "../ui/IconContainer"
import './styles/TaskAttachment.css'

export default function TaskAttachment(props) {

  const { myOrgID, setToasts } = useContext(StoreContext)
  const { name, size, type, dateUploaded, url, 
    projectID, taskID, fileID } = props.file
  const { setUploadLoading, onClick } = props
  const isPhoto = type.includes('image')
  const isVideo = type.includes('video')
  const filesPath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/files`

  const handleDeleteFile = () => {
    const confirm = window.confirm(`Are you sure you want to delete this file?`)
    if(!confirm) return 
    deleteOrgProjectTaskFilesService(
      filesPath, 
      fileID, 
      name,
      setToasts, 
      setUploadLoading
    )
  }

  return (
    <div 
      className="attachment-item"
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
        <div className="cover">
          <div className="actions">
            <IconContainer
              icon="fas fa-cloud-download-alt"
              iconColor="var(--grayText)"
              dimensions={23}
              iconSize={13}
              round={false}
              onClick={() => downloadUsingFetch(url, name)}
            />
            <IconContainer
              icon="far fa-times"
              iconColor="var(--grayText)"
              dimensions={23}
              iconSize={15}
              round={false}
              onClick={() => handleDeleteFile()}
            />
          </div>
        </div>
      </div>
      <div className="bottom">
        <h6 title={name}>{truncateTextWithExt(name, 18)}</h6>
        <small>
          {convertBytesToKbMbGb(size, 0)} &#x2022;&nbsp;
          {convertClassicDate(dateUploaded?.toDate())}
        </small>
      </div>
    </div>
  )
}
