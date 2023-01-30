import { infoToast } from "app/data/toastsTemplates"
import { useOrgPostComments } from "app/hooks/postsHooks"
import { createOrgPostCommentService } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useRef, useState } from 'react'
import EmojiTextarea from "../ui/EmojiTextarea"
import CommentItem from "./CommentItem"
import './styles/PostComments.css'

export default function PostComments(props) {

  const { myUserImg, myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { showComments, post, commentsNum, commentInputRef,
    setShowLikesModal, setLikesStats } = props
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentUploadedImgs, setCommentUploadedImg] = useState([])
  const [loading, setLoading] = useState(false)
  const [showReplySection, setShowReplySection] = useState(null)
  const limitsNum = 7
  const [commentsLimit, setCommentsLimit] = useState(limitsNum)
  const commentUploadRef = useRef(null)
  const comments = useOrgPostComments(post?.postID, commentsLimit)
  const isNotEmptyMessage = /\S/.test(commentText)

  const commentList = comments?.map((comment, index) => {
    return <CommentItem
      key={index}
      comment={comment}
      showReplySection={showReplySection}
      setShowReplySection={setShowReplySection}
      setShowLikesModal={setShowLikesModal}
      setLikesStats={setLikesStats}
    />
  })

  const editReset = () => {
    setCommentText('')
    setCommentUploadedImg([])
    commentUploadRef.current.value = ''
  }

  const handlePressEnter = (e) => {
    if (!isNotEmptyMessage) return
    if (commentUploadedImgs.length > 15) return setToasts(infoToast("You can only upload a maximum of 15 images.", true))
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      createOrgPostCommentService(
        myUserID,
        myOrgID,
        post?.postID,
        commentText,
        commentUploadedImgs,
        setLoading,
        setToasts
      )
        .then(() => {
          editReset()
        })
    }
  }

  return showComments && (
    <div className="post-comments">
      <div className="add-comment-section">
        <EmojiTextarea
          placeholder="Write a comment..."
          showPicker={showEditPicker}
          setShowPicker={setShowEditPicker}
          messageText={commentText}
          setMessageText={setCommentText}
          uploadedImgs={commentUploadedImgs}
          setUploadedImgs={setCommentUploadedImg}
          loading={loading}
          setLoading={setLoading}
          handlePressEnter={(e) => handlePressEnter(e)}
          enableImgUploading
          uploadRef={commentUploadRef}
          inputRef={commentInputRef}
          avatar={myUserImg}
          avatarDimensions={33}
        />
      </div>
      <div className="comments-list">
        {commentList}
        {
          commentsLimit < commentsNum &&
          <small
            className="view-more-text"
            onClick={() => setCommentsLimit(prev => prev + limitsNum)}
          >View more comments</small>
        }
      </div>
    </div>
  )
}
