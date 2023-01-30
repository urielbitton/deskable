import { infoToast } from "app/data/toastsTemplates"
import { createOrgPostService } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useRef, useState } from 'react'
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import EmojiTextarea from "../ui/EmojiTextarea"
import './styles/PostConsole.css'

export default function PostConsole(props) {

  const { myUser, myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { title } = props
  const [showPicker, setShowPicker] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [uploadedImgs, setUploadedImgs] = useState([])
  const [loading, setLoading] = useState(false)
  const uploadRef = useRef(null)
  const isNotEmptyMessage = /\S/.test(messageText) || uploadedImgs.length > 0

  const createPost = (e) => {
    if(!isNotEmptyMessage || loading) return 
    if(uploadedImgs.length > 15) return setToasts(infoToast('You can only upload a maximum of 15 images.', true))
    createOrgPostService(
      myUserID,
      myOrgID,
      messageText,
      uploadedImgs,
      setLoading,
      setToasts
    )
    .then(() => {
      setMessageText('')
      setUploadedImgs([])
    })
  }

  return (
    <div className="post-console">
      <div className="top">
        <h5>{title}</h5>
      </div>
      <div className="bottom">
        <Avatar
          src={myUser?.photoURL}
          dimensions={33}
          alt="avatar"
        />
        <EmojiTextarea
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          messageText={messageText}
          setMessageText={setMessageText}
          uploadedImgs={uploadedImgs}
          setUploadedImgs={setUploadedImgs}
          loading={loading}
          setLoading={setLoading}
          enableImgUploading
          uploadRef={uploadRef}
        />
      </div>
      {
        isNotEmptyMessage &&
        <div className="actions">
          <AppButton
            label="Post"
            onClick={createPost}
            rightIcon={loading && 'fal fa-spinner-third fa-spin'}
            disabled={!isNotEmptyMessage || loading}
          />
        </div>
      }
    </div>
  )
}
