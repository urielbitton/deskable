import { useOrgPostComments } from "app/hooks/postsHooks"
import { createOrgPostCommentService } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useRef, useState } from 'react'
import EmojiTextarea from "../ui/EmojiTextarea"
import CommentItem from "./CommentItem"
import './styles/PostComments.css'

export default function PostComments(props) {

  const { myUserImg, myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { showComments, post } = props
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentUploadedImgs, setCommentUploadedImg] = useState([])
  const [loading, setLoading] = useState(false)
  const [commentsLimit, setCommentsLimit] = useState(7)
  const commentUploadRef = useRef(null)
  const comments = useOrgPostComments(post?.postID, commentsLimit)
  const isNotEmptyMessage = /\S/.test(commentText)

  const commentList = comments?.map((comment, index) => {
    return <CommentItem
      key={index}
      comment={comment}
    />
  })

  const handlePressEnter = (e) => {
    if (!isNotEmptyMessage) return
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
          setCommentText('')
          setCommentUploadedImg([])
          commentUploadRef.current.value = ''
        })
    }
  }

  return showComments && (
    <div className="post-comments">
      <div className="comments-list">
        {commentList}
      </div>
      <div className="add-comment-section">
        <EmojiTextarea
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
          avatar={myUserImg}
          avatarSize={33}
        />
      </div>
    </div>
  )
}
