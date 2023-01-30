import { infoToast } from "app/data/toastsTemplates"
import { useOrgPostSubComments } from "app/hooks/postsHooks"
import { createOrgPostSubCommentService } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import EmojiTextarea from "../ui/EmojiTextarea"
import SubCommentItem from "./SubCommentItem"
import './styles/PostComments.css'

export default function PostSubComments(props) {

  const { myUserImg, myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { postID, showReplySection, setShowReplySection, 
    commentID, subCommentsNum, commentInputRef, setShowLikesModal,
    setLikesStats } = props
  const [showEditPicker, setShowEditPicker] = useState(false)
  const [subCommentText, setSubCommentText] = useState('')
  const [commentUploadedImgs, setCommentUploadedImgs] = useState([])
  const [loading, setLoading] = useState(false)
  const limitsNum = 7
  const [commentsLimit, setCommentsLimit] = useState(limitsNum)
  const commentUploadRef = useRef(null)
  const subComments = useOrgPostSubComments(postID, commentID, commentsLimit)
  const isNotEmptyMessage = /\S/.test(subCommentText)

  const subCommentsList = subComments?.map((subComment, index) => {
    return <SubCommentItem
      key={index}
      subComment={subComment}
      setShowLikesModal={setShowLikesModal}
      setLikesStats={setLikesStats}
    />
  })

  const handlePressEnter = (e) => {
    if (!isNotEmptyMessage) return
    if (commentUploadedImgs.length > 15) return setToasts(infoToast("You can only upload a maximum of 15 images.", true))
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      createOrgPostSubCommentService(
        myUserID,
        myOrgID,
        postID,
        commentID,
        subCommentText,
        commentUploadedImgs,
        setLoading,
        setToasts
      )
        .then(() => {
          setSubCommentText('')
          setCommentUploadedImgs([])
          commentUploadRef.current.value = ''
        })
    }
  }

  useEffect(() => {
    if(showReplySection === commentID) 
      commentInputRef.current.focus()
  },[showReplySection])

  return (
    <div className="post-sub-comments">
      {
        showReplySection === commentID &&
        <div className="comment-reply-section">
          <EmojiTextarea
            placeholder="Write a reply..."
            showPicker={showEditPicker}
            setShowPicker={setShowEditPicker}
            messageText={subCommentText}
            setMessageText={setSubCommentText}
            uploadedImgs={commentUploadedImgs}
            setUploadedImgs={setCommentUploadedImgs}
            handlePressEnter={(e) => handlePressEnter(e)}
            loading={loading}
            setLoading={setLoading}
            enableImgUploading
            uploadRef={commentUploadRef}
            inputRef={commentInputRef}
            avatar={myUserImg}
            avatarDimensions={27}
          />
        </div>
      }
      <div className={`sub-comments-list ${showReplySection === commentID ? 'has-comments' : ''}`}>
        {subCommentsList}
        {
          commentsLimit < subCommentsNum &&
          <small
            className="view-more-text"
            onClick={() => setCommentsLimit(prev => prev + limitsNum)}
          >View more comments</small>
        }
      </div>
      {
        subComments.length > 0 &&
        <small
          className="toggle-sub-comments-text"
          onClick={() => setShowReplySection(prev => prev === commentID ? null : commentID)}
        >
          <i className={`fas fa-reply ${showReplySection === commentID ? 'reverse' : ''}`} />
          {showReplySection !== commentID ? subCommentsNum : 'Hide'} Replies
        </small>
      }
    </div>
  )
}
