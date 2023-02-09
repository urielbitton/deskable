import { convertBytesToKbMbGb, downloadUsingFetch, fileTypeConverter } from "app/utils/fileUtils"
import React, { useEffect, useState } from 'react'
import { DocumentViewer } from 'react-documents'
import AppButton from "../ui/AppButton"
import AppPortal from "../ui/AppPortal"
import IconContainer from "../ui/IconContainer"
import './styles/DocViewerModal.css'

export default function DocViewerModal(props) {

  const { viewer='google', file, showModal, setShowModal,
    portalClassName } = props
  const [loading, setLoading] = useState(true)
  const [showTopbar, setShowTopbar] = useState(true)
  const isMediaFile = file?.type?.includes('image') || file?.type?.includes('video')
  const docViewerType = isMediaFile ? 'url' : viewer

  useEffect(() => {
    if(showTopbar) {
      const timer = setTimeout(() => {
        setShowTopbar(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showTopbar])

  return (
    <AppPortal
      showPortal={showModal}
      className={portalClassName}
    >
      <div 
        className={`doc-viewer-container ${showModal ? 'show' : ''}`}
        onMouseMove={() => setShowTopbar(true)}
      >
        {
          file &&
          <>
            <div className={`doc-viewer ${!loading ? 'show' : ''}`}>
              <div className={`top-bar ${showTopbar ? 'show' : ''}`}>
                <div className="left">
                  <IconContainer
                    icon={fileTypeConverter(file.type).icon}
                    bgColor={fileTypeConverter(file.type).color}
                    iconColor="#fff"
                    dimensions={37}
                    iconSize={19}
                    round={false}
                  />
                  <div className="file-details">
                    <h5>{file.name}</h5>
                    <small>
                      {convertBytesToKbMbGb(file.size, 0)}
                      &nbsp;&#8226;&nbsp;
                      {file.type}
                    </small>
                  </div>
                </div>
                <div className="right">
                  <IconContainer
                    icon="fas fa-cloud-download-alt"
                    iconColor="#fff"
                    dimensions={30}
                    iconSize={17}
                    round={false}
                    onClick={() => downloadUsingFetch(file.url, file.name)}
                    />
                  <IconContainer
                    icon="fal fa-times"
                    iconColor="#fff"
                    dimensions={30}
                    iconSize={23}
                    round={false}
                    onClick={() => setShowModal(false)}
                  />
                </div>
              </div>
              <DocumentViewer
                url={file.url}
                viewer={docViewerType}
                loaded={() => setLoading(false)}
              />
            </div>
            {
              loading &&
              <div className="loading-container">
                <i className="fas fa-spinner fa-spin" />
              </div>
            }
          </>
        }
      </div>
    </AppPortal>
  )
}
