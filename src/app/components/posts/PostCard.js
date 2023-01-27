import useUser, { useDocsCount } from "app/hooks/userHooks"
import {
  addPostLikeService, addPostSavedService,
  deleteOrgPostService,
  removePostLikeService, removePostSavedService, updateOrgPostService
} from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import { getTimeAgo } from "app/utils/dateUtils"
import { detectAndUnderlineAllLinksInText } from "app/utils/generalUtils"
import React, { useContext, useRef, useState } from 'react'
import AppCard from "../ui/AppCard"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import './styles/PostCard.css'
import TextareaAutosize from 'react-textarea-autosize'
import { infoToast } from "app/data/toastsTemplates"
import EmojiTextarea from "../ui/EmojiTextarea"
import AppButton from "../ui/AppButton"
import IconContainer from "../ui/IconContainer"
import { deleteMultipleStorageFiles } from "app/services/storageServices"

export default function PostCard(props) {

  const { myUserID, setToasts } = useContext(StoreContext)
  const { authorID, dateCreated, postID, postText, files,
    orgID, likes, saved } = props.post
  const [showPostOptions, setShowPostOptions] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editPostText, setEditPostText] = useState('')
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [editUploadedImgs, setEditUploadedImgs] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletedFiles, setDeletedFiles] = useState([])
  const postAuthor = useUser(authorID)
  const editUploadRef = useRef(null)
  const fileImgs = files?.filter(file => file.type.includes('image'))
  const hasImgs = fileImgs?.length > 0
  const commentsNum = useDocsCount(`organizations/${orgID}/posts/${postID}/comments`)
  const likesNum = likes.length
  const savedNum = saved.length
  const userHasLiked = likes.includes(myUserID)
  const userHasSaved = saved.includes(myUserID)

  const allowEditSave = (editPostText !== postText
    && editPostText.length > 0
    && !loading)
    || editUploadedImgs.length > 0

  const imgsRender = fileImgs.map((img, index) => {
    return <div
      className={`img-item ${deletedFiles.includes(img.name) ? 'deleted' : ''}`}
      key={index}
    >
      <img
        src={img.url}
        alt="post-img"
      />
      {
        fileImgs.length > 2 && index === 2 &&
        <div className="cover-item">
          <h6>+{fileImgs.length - 2} More</h6>
        </div>
      }
      {
        editMode &&
        <IconContainer
          icon={!deletedFiles.includes(img.name) ? "fas fa-trash" : "fas fa-undo-alt"}
          bgColor="#fff"
          iconColor="var(--red)"
          iconSize="15px"
          tooltip="Remove image"
          dimensions={25}
          onClick={() => {
            !deletedFiles.includes(img.name) ? 
            setDeletedFiles(prev => [...prev, img.name]) : 
            setDeletedFiles(prev => prev.filter(file => file !== img.name))
          }}
          className="delete-img-icon"
        />
      }
    </div>
  })

  const initEditPost = () => {
    setEditMode(true)
    setEditPostText(postText)
  }

  const cancelEditPost = () => {
    setEditMode(false)
    setEditPostText('')
    setEditUploadedImgs([])
    setDeletedFiles([])
  }

  const savePost = () => {
    deleteMultipleStorageFiles(
      `organizations/${orgID}/posts/${postID}/files`,
      deletedFiles
    )
      .then(() => {
        return updateOrgPostService(
          myUserID,
          orgID,
          postID,
          editPostText,
          editUploadedImgs,
          setLoading,
          setToasts
        )
      })
      .then(() => {
        setEditMode(false)
        setEditPostText('')
        setEditUploadedImgs([])
        setDeletedFiles([])
      })
      .catch(err => {
        console.log(err)
        setToasts(infoToast("Error deleting files. Please try again later."))
      })
  }

  const deletePost = () => {
    const confirm = window.confirm("Are you sure you want to delete this post?")
    if (!confirm) return setToasts(infoToast("Post not deleted."))
    deleteOrgPostService(
      orgID,
      postID,
      files.map(file => file.name),
      setLoading,
      setToasts
    )
  }

  const bookmarkPost = () => {

  }

  const handleLike = () => {
    if (!userHasLiked)
      addPostLikeService(myUserID, orgID, postID, setToasts)
    else
      removePostLikeService(myUserID, orgID, postID, setToasts)
  }

  const handleSave = () => {
    if (!userHasSaved)
      addPostSavedService(myUserID, orgID, postID, setToasts)
    else
      removePostSavedService(myUserID, orgID, postID, setToasts)
  }

  return (
    <AppCard
      className="post-card"
      withBorder
      padding="0"
    >
      <div className="header">
        <div className="left">
          <Avatar
            src={postAuthor?.photoURL}
            alt="avatar"
            dimensions={33}
          />
          <div className="texts">
            <h5>{postAuthor?.firstName} {postAuthor?.lastName}</h5>
            <h6>{getTimeAgo(dateCreated?.toDate())}</h6>
          </div>
        </div>
        <div className="right">
          <DropdownIcon
            icon="far fa-ellipsis-h"
            iconColor="var(--lightGrayText)"
            iconSize="16px"
            tooltip="Actions"
            dimensions={27}
            showMenu={showPostOptions === postID}
            setShowMenu={setShowPostOptions}
            onClick={(e) => {
              e.stopPropagation()
              setShowPostOptions(showPostOptions === postID ? null : postID)
            }}
            items={[
              { label: "Edit", icon: "fas fa-pen", onClick: () => initEditPost() },
              { label: "Delete", icon: "fas fa-trash", onClick: () => deletePost() },
              { label: "Save Post", icon: "fas fa-bookmark", onClick: () => bookmarkPost() },
            ]}
          />
        </div>
      </div>
      <div className="content">
        {
          !editMode ?
            <p>
              <span dangerouslySetInnerHTML={{ __html: detectAndUnderlineAllLinksInText(postText) }} />
            </p> :
            <div className="edit-container">
              <EmojiTextarea
                showPicker={showEditPicker}
                setShowPicker={setShowEditPicker}
                messageText={editPostText}
                setMessageText={setEditPostText}
                uploadedImgs={editUploadedImgs}
                setUploadedImgs={setEditUploadedImgs}
                loading={loading}
                setLoading={setLoading}
                enableImgUploading
                uploadRef={editUploadRef}
              />
              <div className="btn-group">
                <AppButton
                  label="Save Post"
                  rightIcon={loading ? "fas fa-spinner fa-spin" : null}
                  onClick={() => savePost()}
                  disabled={!allowEditSave}
                />
                <AppButton
                  label="Cancel"
                  onClick={() => cancelEditPost()}
                  disabled={editPostText.length < 1}
                />
              </div>
            </div>
        }
        {
          hasImgs &&
          <div className={`imgs-masonry ${fileImgs.length > 2 ? 'three' : fileImgs.length > 1 ? 'two' : ''}`}>
            {imgsRender}
          </div>
        }
        <div className="user-actions">
          <div onClick={() => setShowComments(prev => !prev)}>
            <i className="far fa-comment" />
            <h6>{commentsNum > 0 ? commentsNum : ''} Comment{commentsNum > 1}</h6>
          </div>
          <div onClick={() => handleLike()}>
            <i className={`fa${userHasLiked ? 's' : 'r'} fa-heart`} />
            <h6>{likesNum > 0 ? likesNum : ''} Like{likesNum > 0}</h6>
          </div>
          <div onClick={() => handleSave()}>
            <i className={`fa${userHasSaved ? 's' : 'r'} fa-bookmark`} />
            <h6>{savedNum > 0 ? savedNum : ''} Save{savedNum > 0}</h6>
          </div>
        </div>
      </div>
    </AppCard>
  )
}
