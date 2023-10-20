import React from 'react'
import AppButton from "./AppButton"
import IconContainer from "./IconContainer"
import './styles/NotifPermissionsBar.css'
import AppPortal from "./AppPortal"

export default function NotifPermissionsBar(props) {

  const { onStopped, onClose, text, showBar } = props

  return (
    <AppPortal
      showPortal={showBar}
      className="permissions-bar-portal"
    >
      <div className="permissions-bar">
        <div className="left-side">
          <h5 className="text">{text}</h5>
          <div className="actions">
            <AppButton
              label="Cancel"
              onClick={onStopped}
              buttonType="outlineWhiteBtn"
            />
          </div>
        </div>
        <div className="right-side">
          <IconContainer
            icon="fal fa-times"
            onClick={onClose}
            iconSize={21}
            round={false}
            iconColor="#fff"
          />
        </div>
      </div>
    </AppPortal>
  )
}
