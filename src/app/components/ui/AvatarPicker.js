import React from 'react'
import AppButton from "./AppButton"
import AppModal from "./AppModal"
import Avatar from "./Avatar"
import './styles/AvatarPicker.css'

export default function AvatarPicker(props) {

  const { avatarsList, showModal, setShowModal,
    activeAvatar, pickerDimensions, avatarsDimensions,
    showUploader, onAvatarClick, name, label,
    btnLabel } = props

  const avatarsListRender = avatarsList?.map((avatar, index) => {
    return <Avatar
      src={avatar.src}
      dimensions={avatarsDimensions}
      className={`avatar-item ${activeAvatar.src === avatar.src ? 'active' : ''}`}
      onClick={() => onAvatarClick(avatar)}
      key={index}
      round={false}
    />
  })

  return (
    <div className="avatar-picker">
      <div className="picker-content">
        <Avatar
          src={activeAvatar.src}
          dimensions={pickerDimensions}
          round={false}
          onClick={() => setShowModal(prev => prev === name ? null : name)}
        />
        {
          !btnLabel ?
            <h6>{label}</h6> :
            <AppButton
              label={btnLabel}
              buttonType="invertedBtn"
              onClick={() => setShowModal(prev => prev === name ? null : name)}
            />
        }
      </div>
      <AppModal
        showModal={showModal}
        setShowModal={setShowModal}
        label="Select Avatar"
        portalClassName="avatar-picker-modal"
        actions={
          <>
            <AppButton
              label="Pick"
              onClick={() => setShowModal(null)}
            />
            <AppButton
              label="Cancel"
              buttonType="invertedBtn"
              onClick={() => setShowModal(null)}
            />
          </>
        }
      >
        {
          showUploader &&
          <div className="avatar-upload-container">

          </div>
        }
        <div className="avatars-list">
          {avatarsListRender}
        </div>
      </AppModal>
    </div>
  )
}
