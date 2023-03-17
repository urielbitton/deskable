import { reportOrgPostOptions } from "app/data/general"
import useUser from "app/hooks/userHooks"
import {
  addPostCommentLikeService, deleteOrgPostCommentService,
  removePostCommentLikeService,
  updateOrgPostCommentService
} from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import { getTimeAgo } from "app/utils/dateUtils"
import { sendCursorToEnd } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import AppLink from "../ui/AppLink"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import EmojiTextarea from "../ui/EmojiTextarea"
import IconContainer from "../ui/IconContainer"
import ImgSkeleton from "../ui/ImgSkeleton"
import ReportModal from "../ui/ReportModal"
import './styles/CommentItem.css'

export default function SubCommentItem(props) {

  const { myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { commentText, dateCreated, likes, authorID, file,
    postID, commentID, subCommentID } = props.subComment
  const { setShowLikesModal, setLikesStats, setShowPhotosModal,
    editMode, setEditMode, commentInputRef } = props
  const [showCommentMenu, setShowCommentMenu] = useState(false)
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [editPostText, setEditPostText] = useState('')
  const [loading, setLoading] = useState(false)
  const [editUploadedImgs, setEditUploadedImgs] = useState([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportMessage, setReportMessage] = useState("")
  const [reportLoading, setReportLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const author = useUser(authorID)
  const editUploadRef = useRef(null)
  const editCommentInputRef = useRef(null)
  const hasImg = file?.type?.includes('image')
  const likesNum = likes?.length
  const hidePrivateOptions = myUserID !== authorID
  const userHasLiked = likes?.includes(myUserID)
  const subCommentsPath = `organizations/${myOrgID}/posts/${postID}/comments/${commentID}/subComments`
  const subCommentsStoragePath = `organizations/${myOrgID}/posts/${postID}/comments/${commentID}/subComments/${subCommentID}/files`

  const editComment = () => {
    setEditMode(subCommentID)
    setEditPostText(commentText)
  }

  const resetEdit = () => {
    setEditMode(null)
    setEditPostText('')
    setEditUploadedImgs([])
    editUploadRef.current.value = ''
  }

  const initReplySubComment = () => {
    commentInputRef.current.focus()
  }

  const toggleLikeComment = () => {
    if (!userHasLiked) {
      addPostCommentLikeService(
        subCommentsPath,
        myUserID,
        subCommentID,
        setToasts
      )
    }
    else {
      removePostCommentLikeService(
        subCommentsPath,
        myUserID,
        subCommentID,
        setToasts
      )
    }
  }

  const saveComment = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      updateOrgPostCommentService(
        subCommentsPath,
        subCommentsStoragePath,
        subCommentID,
        editPostText,
        editUploadedImgs,
        setLoading,
        setToasts
      )
        .then(() => {
          resetEdit()
        })
    }
  }

  const deleteComment = () => {
    const confirm = window.confirm('Are you sure you want to delete this comment?')
    if (!confirm) return
    deleteOrgPostCommentService(
      subCommentsPath,
      subCommentsStoragePath,
      subCommentID,
      file ? [file?.name] : null,
      setLoading,
      setToasts
    )
  }

  const initLikesStats = () => {
    setShowLikesModal(true)
    setLikesStats(likes)
  }

  const initShowPhotoModal = () => {
    if (editMode !== subCommentID) {
      setShowPhotosModal({
        show: true,
        photos: [file],
      })
    }
  }

  useEffect(() => {
    if (editMode === subCommentID) {
      sendCursorToEnd(editCommentInputRef)
    }
  }, [editMode])

  return author && (
    <div className="comment-item sub-comment-item">
      <div className="left-side">
        <Avatar
          src={author?.photoURL}
          dimensions={27}
        />
      </div>
      <div className="right-side">
        <div className="comment-top">
          <div className="comment-bubble">
            <h6>{author.firstName} {author.lastName}</h6>
            {
              editMode !== subCommentID ?
                <p>
                  <AppLink text={commentText} />
                </p> :
                <div className="edit-container">
                  <EmojiTextarea
                    placeholder="Write a reply..."
                    showPicker={showEditPicker}
                    setShowPicker={setShowEditPicker}
                    messageText={editPostText}
                    setMessageText={setEditPostText}
                    uploadedImgs={editUploadedImgs}
                    setUploadedImgs={setEditUploadedImgs}
                    handlePressEnter={saveComment}
                    loading={loading}
                    setLoading={setLoading}
                    enableImgUploading
                    uploadRef={editUploadRef}
                    inputRef={editCommentInputRef}
                  />
                  <div className="btn-group">
                    <small onClick={() => saveComment()}>Save</small>
                    <small onClick={() => resetEdit()}>Cancel</small>
                  </div>
                </div>
            }
            {
              hasImg &&
              <div className="comment-img-container">
                <img
                  src={file.url}
                  alt="comment-img"
                  onClick={() => initShowPhotoModal()}
                  onLoad={() => setImgLoading(false)}
                />
                <ImgSkeleton loading={imgLoading} />
                {
                  editMode === subCommentID &&
                  <IconContainer
                    icon="fas fa-times"
                    iconSize="15px"
                    iconColor="#333"
                    dimensions={25}
                  />
                }
              </div>
            }
          </div>
          <DropdownIcon
            icon="far fa-ellipsis-h"
            iconSize="15px"
            iconColor="var(--grayText)"
            dimensions={25}
            showMenu={showCommentMenu === subCommentID}
            setShowMenu={setShowCommentMenu}
            items={[
              { label: 'Edit', icon: 'fas fa-pen', onClick: () => editComment(), private: hidePrivateOptions },
              { label: 'Delete', icon: 'fas fa-trash', onClick: () => deleteComment(), private: hidePrivateOptions },
              { label: 'Report', icon: 'fas fa-flag', onClick: () => setShowReportModal(true), private: myUserID === authorID },
            ]}
            onClick={() => setShowCommentMenu(prev => prev !== subCommentID ? subCommentID : null)}
          />
        </div>
        <div className="comment-actions">
          <small
            onClick={() => toggleLikeComment()}
            className={userHasLiked ? 'liked' : ''}
          >
            {!userHasLiked ? 'Like' : 'Unlike'}
          </small>
          <small onClick={() => initReplySubComment()}>
            Reply
          </small>
          <small className="no-underline">
            <span>{getTimeAgo(dateCreated?.toDate())}</span>
          </small>
          {
            likesNum > 0 &&
            <div
              className="likes-counter"
              onClick={() => initLikesStats()}
            >
              <div className="like-btn">
                <i className="fas fa-heart" />
              </div>
              <small>{likesNum}</small>
            </div>
          }
        </div>
      </div>
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
        reportedContent={commentText}
      />
    </div>
  )
}
