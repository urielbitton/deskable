import useUser, { useDocsCount } from "app/hooks/userHooks"
import {
  addPostLikeService, addPostSavedService,
  deleteOrgPostService,
  removePostLikeService, removePostSavedService, updateOrgPostService
} from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import { getTimeAgo } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import AppCard from "../ui/AppCard"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import './styles/PostCard.css'
import { infoToast } from "app/data/toastsTemplates"
import EmojiTextarea from "../ui/EmojiTextarea"
import AppButton from "../ui/AppButton"
import IconContainer from "../ui/IconContainer"
import { deleteMultipleStorageFiles } from "app/services/storageServices"
import PostComments from "./PostComments"
import AppLink from "../ui/AppLink"
import { useNavigate } from "react-router-dom"
import PhotosModal from "../ui/PhotosModal"
import ReportModal from "../ui/ReportModal"
import { reportOrgPostOptions } from "app/data/general"
import ImgSkeleton from "../ui/ImgSkeleton"

export default function PostCard(props) {

  const { myUserID, setToasts } = useContext(StoreContext)
  const { authorID, dateCreated, postID, postText, files,
    orgID, likes, saved } = props.post
  const { setShowLikesModal, setLikesStats, setShowSavedModal, 
    setSavedStats } = props
  const [showReportModal, setShowReportModal] = useState(false)
  const [showPostOptions, setShowPostOptions] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [editMode, setEditMode] = useState(null)
  const [editPostText, setEditPostText] = useState('')
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [editUploadedImgs, setEditUploadedImgs] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletedFiles, setDeletedFiles] = useState([])
  const [showPhotosModal, setShowPhotosModal] = useState({show: false, photos: []})
  const [reportReason, setReportReason] = useState("")
  const [reportMessage, setReportMessage] = useState("")
  const [reportLoading, setReportLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  const postAuthor = useUser(authorID)
  const editUploadRef = useRef(null)
  const commentInputRef = useRef(null)
  const fileImgs = files?.filter(file => file?.type?.includes('image'))
  const hasImgs = fileImgs?.length > 0
  const commentsNum = useDocsCount(`organizations/${orgID}/posts/${postID}/comments`)
  const likesNum = likes.length
  const savedNum = saved.length
  const userHasLiked = likes.includes(myUserID)
  const userHasSaved = saved.includes(myUserID)
  const navigate = useNavigate()
  const pathPrefix = `/organizations/${orgID}/posts`

  const allowEditSave = (editPostText !== postText
    && editPostText.length > 0
    && !loading)
    || editUploadedImgs.length > 0
    || deletedFiles.length > 0

  const imgsRender = fileImgs
    ?.slice(0, 3)
    .map((img, index) => {
      return <div
        className={`img-item ${deletedFiles.includes(img.name) ? 'deleted' : ''}`}
        onClick={() => navigate(`/posts/${postID}/photos?index=${index}`)}
        key={index}
      >
        <img
          src={img.url}
          alt="post-img"
          onLoad={() => setImgLoading(false)}
        />
        <ImgSkeleton loading={imgLoading} />
        {
          fileImgs.length > 3 && index === 2 &&
          <div className="cover-item">
            <h6>+{fileImgs.length - 3} More</h6>
          </div>
        }
        {
          editMode === postID &&
          <IconContainer
            icon={!deletedFiles.includes(img.name) ? "fas fa-trash" : "fas fa-undo-alt"}
            bgColor="#fff"
            iconColor="var(--red)"
            iconSize="15px"
            tooltip="Remove image"
            dimensions={25}
            onClick={() => removeExistingImg(img.name)}
            className="delete-img-icon"
          />
        }
      </div>
    })

  const initEditPost = () => {
    setEditMode(postID)
    setEditPostText(postText)
  }

  const cancelEditPost = () => {
    setEditMode(null)
    setEditPostText('')
    setEditUploadedImgs([])
    setDeletedFiles([])
  }

  const removeExistingImg = (imgName) => {
    if (!deletedFiles.includes(imgName)) {
      setDeletedFiles(prev => [...prev, imgName])
    }
    else {
      setDeletedFiles(prev => prev.filter(file => file !== imgName))
    }
  }

  const updatePost = () => {
    if (myUserID !== authorID) return setToasts(infoToast("You do not have permission to edit this post."))
    if (!allowEditSave) return setToasts(infoToast("Please add some text or images to save."))
    if (editUploadedImgs.length > 15) return setToasts(infoToast("You can only upload a maximum of 15 images.", true))
    setLoading(true)
    deleteMultipleStorageFiles(
      `organizations/${orgID}/posts/${postID}/files`,
      deletedFiles
    )
      .then(() => {
        return updateOrgPostService(
          pathPrefix,
          postID,
          editPostText,
          files,
          editUploadedImgs,
          deletedFiles,
          setLoading,
          setToasts
        )
      })
      .then(() => {
        setEditMode(null)
        setEditPostText('')
        setEditUploadedImgs([])
        setDeletedFiles([])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        setToasts(infoToast("Error deleting files. Please try again later."))
      })
  }

  const deletePost = () => {
    if (myUserID !== authorID) return setToasts(infoToast("You do not have permission to delete this post."))
    const confirm = window.confirm("Are you sure you want to delete this post?")
    if (!confirm) return setToasts(infoToast("Post not deleted."))
    deleteOrgPostService(
      pathPrefix,
      postID,
      setLoading,
      setToasts
    )
  }

  const handleLike = () => {
    if (!userHasLiked)
      addPostLikeService(myUserID, orgID, postID, setToasts)
    else
      removePostLikeService(myUserID, orgID, postID, setToasts)
  }

  const bookmarkPost = () => {
    if (!userHasSaved)
      addPostSavedService(myUserID, orgID, postID, setToasts)
    else
      removePostSavedService(myUserID, orgID, postID, setToasts)
  }

  const initLikesStats = () => {
    setShowLikesModal(true)
    setLikesStats(likes)
  }

  const initSavedStats = () => {
    setShowSavedModal(true)
    setSavedStats(saved)
  }

  useEffect(() => {
    if (showComments) {
      commentInputRef.current?.focus()
    }
  }, [showComments])

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
            onClick={(e) => setShowPostOptions(showPostOptions === postID ? null : postID)}
            items={[
              { label: "Edit", icon: "fas fa-pen", onClick: () => initEditPost(), private: authorID !== myUserID },
              { label: "Delete", icon: "fas fa-trash", onClick: () => deletePost(), private: authorID !== myUserID },
              { label: userHasSaved ? 'Unsave Post' : 'Save Post', icon: "fas fa-bookmark", onClick: () => bookmarkPost() },
              { label: "Report", icon: "fas fa-flag", onClick: () => setShowReportModal(true) },
            ]}
          />
        </div>
      </div>
      <div className="content">
        {
          editMode !== postID ?
            <p>
              <AppLink text={postText} />
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
                  onClick={() => updatePost()}
                  disabled={!allowEditSave}
                />
                <AppButton
                  label="Cancel"
                  onClick={() => cancelEditPost()}
                />
              </div>
            </div>
        }
        {
          hasImgs &&
          <div className={`imgs-masonry ${fileImgs.length > 2 ? 'three' : fileImgs.length > 1 ? 'two' : ''} ${editMode === postID ? 'edit-mode' : ''}`}>
            {imgsRender}
          </div>
        }
        <div className="stats-info">
          {
            likesNum > 0 &&
            <small onClick={() => initLikesStats()}>
              <i className="far fa-heart" />
              {likesNum} like{likesNum !== 1 ? 's' : ''}
            </small>
          }
          {
            commentsNum > 0 &&
            <small
              onClick={() => setShowComments(true)}
            >
              <i className="far fa-comment" />
              {commentsNum} comment{commentsNum !== 1 ? 's' : ''}
            </small>
          }
          {
            savedNum > 0 &&
            <small onClick={() => initSavedStats()}>
              <i className="far fa-bookmark" />
              {savedNum} save{savedNum !== 1 ? 'd' : ''}
            </small>
          }
        </div>
      </div>
      <div className="user-actions">
        <div onClick={() => setShowComments(prev => !prev)}>
          <i className="far fa-comment" />
          <h6>Comment</h6>
        </div>
        <div onClick={() => handleLike()}>
          <i className={`fa${userHasLiked ? 's' : 'r'} fa-heart`} />
          <h6>Like{userHasLiked && 'd'}</h6>
        </div>
        <div onClick={() => bookmarkPost()}>
          <i className={`fa${userHasSaved ? 's' : 'r'} fa-bookmark`} />
          <h6>Save{userHasSaved && 'd'}</h6>
        </div>
      </div>
      <PostComments
        post={props.post}
        showComments={showComments}
        commentsNum={commentsNum}
        commentInputRef={commentInputRef}
        setShowLikesModal={setShowLikesModal}
        setLikesStats={setLikesStats}
        setShowSavedModal={setShowSavedModal}
        setSavedStats={setSavedStats}
        setShowPhotosModal={setShowPhotosModal}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <PhotosModal
        showModal={showPhotosModal.show}
        photos={showPhotosModal.photos}
        onClose={() => setShowPhotosModal({ show: false, photos: [] })}
      />
      <ReportModal
        reportOptions={reportOrgPostOptions}
        showModal={showReportModal}
        setShowModal={setShowReportModal}
        reportReason={reportReason}
        setReportReason={setReportReason}
        reportMessage={reportMessage}
        setReportMessage={setReportMessage}
        loading={reportLoading}
        setReportLoading={setReportLoading}
        reportedContent={postText}
      />
    </AppCard>
  )
}
