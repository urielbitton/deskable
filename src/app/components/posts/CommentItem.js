import { reportOrgPostOptions } from "app/data/general"
import useUser, { useDocsCount } from "app/hooks/userHooks"
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
import PostSubComments from "./PostSubComments"
import './styles/CommentItem.css'

export default function CommentItem(props) {

  const { myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { commentText, dateCreated, likes, authorID, file,
    postID, commentID } = props.comment
  const { showReplySection, setShowReplySection, commentInputRef,
    setShowLikesModal, setLikesStats, setShowPhotosModal,
    editMode, setEditMode } = props
  const [showCommentMenu, setShowCommentMenu] = useState(false)
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [editPostText, setEditPostText] = useState('')
  const [loading, setLoading] = useState(false)
  const [editUploadedImgs, setEditUploadedImgs] = useState([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  const author = useUser(authorID)
  const editUploadRef = useRef(null)
  const subCommentInputRef = useRef(null)
  const editCommentInputRef = useRef(null)
  const hasImg = file?.type?.includes('image')
  const likesNum = likes?.length
  const hidePrivateOptions = myUserID !== authorID
  const userHasLiked = likes?.includes(myUserID)
  const commentsPath = `organizations/${myOrgID}/posts/${postID}/comments`
  const commentsStoragePath = `organizations/${myOrgID}/posts/${postID}/comments/${commentID}/files`
  const subCommentsNum = useDocsCount(`organizations/${myOrgID}/posts/${postID}/comments/${commentID}/subComments`)

  const editComment = () => {
    setEditMode(commentID)
    setEditPostText(commentText)
  }

  const resetEdit = () => {
    setEditMode(null)
    setEditPostText('')
    setEditUploadedImgs([])
    editUploadRef.current.value = ''
  }

  const initReply = () => {
    setShowReplySection(prev => prev !== commentID ? commentID : null)
    if (showReplySection !== commentID)
      commentInputRef.current.focus()
  }

  const toggleLikeComment = () => {
    if (!userHasLiked) {
      addPostCommentLikeService(
        commentsPath,
        myUserID,
        commentID,
        setToasts
      )
    }
    else {
      removePostCommentLikeService(
        commentsPath,
        myUserID,
        commentID,
        setToasts
      )
    }
  }

  const saveComment = (e, click) => {
    if (click || (e.key === 'Enter' && !e.shiftKey)) {
      e.preventDefault()
      updateOrgPostCommentService(
        commentsPath,
        commentsStoragePath,
        commentID,
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
      commentsPath,
      commentsStoragePath,
      commentID,
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
    if (editMode !== commentID) {
      setShowPhotosModal({
        show: true,
        photos: [file],
      })
    }
  }

  useEffect(() => {
    if (editMode === commentID) {
      sendCursorToEnd(editCommentInputRef)
    }
  }, [editMode])

  return author && (
    <div 
      className="comment-item"
      key={commentID}
    >
      <div className="left-side">
        <Avatar
          src={author.photoURL}
          dimensions={27}
        />
      </div>
      <div className="right-side">
        <div className="comment-top">
          <div className="comment-bubble">
            <h6>{author.firstName} {author.lastName}</h6>
            {
              editMode !== commentID ?
                <p>
                  <AppLink text={commentText} />
                </p> :
                <div className="edit-container">
                  <EmojiTextarea
                    placeholder="Edit comment..."
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
                    <small onClick={(e) => saveComment(e, 'click')}>Save</small>
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
                  editMode === commentID &&
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
          {
            editMode !== commentID &&
            <DropdownIcon
              icon="far fa-ellipsis-h"
              iconSize="15px"
              iconColor="var(--grayText)"
              dimensions={25}
              showMenu={showCommentMenu === commentID}
              setShowMenu={setShowCommentMenu}
              items={[
                { label: 'Edit', icon: 'fas fa-pen', onClick: () => editComment(), private: hidePrivateOptions },
                { label: 'Delete', icon: 'fas fa-trash', onClick: () => deleteComment(), private: hidePrivateOptions },
                { label: 'Report', icon: 'fas fa-flag', onClick: () => setShowReportModal(true), private: myUserID === authorID },
              ]}
              onClick={() => setShowCommentMenu(prev => prev !== commentID ? commentID : null)}
            />
          }
        </div>
        <div className="comment-actions">
          <small
            onClick={() => toggleLikeComment()}
            className={userHasLiked ? 'liked' : ''}
          >{!userHasLiked ? 'Like' : 'Unlike'}</small>
          <small onClick={() => initReply()}>Reply</small>
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
        <PostSubComments
          showReplySection={showReplySection}
          setShowReplySection={setShowReplySection}
          postID={postID}
          commentID={commentID}
          subCommentsNum={subCommentsNum}
          commentInputRef={subCommentInputRef}
          setShowLikesModal={setShowLikesModal}
          setLikesStats={setLikesStats}
          setShowPhotosModal={setShowPhotosModal}
          editMode={editMode}
          setEditMode={setEditMode}
        />
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
