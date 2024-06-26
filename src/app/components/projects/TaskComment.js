import { infoToast } from "app/data/toastsTemplates"
import useUser from "app/hooks/userHooks"
import { deleteOrgProjectTaskCommentService, 
  likeOrgProjectTaskCommentService, 
  updateOrgProjectTaskCommentService } from "app/services/projectsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import HtmlDisplayer from "../ui/HtmlDisplayer"
import WysiwygEditor from "../ui/WysiwygEditor"
import './styles/TaskComment.css'
import AppLink from "../ui/AppLink"

export default function TaskComment(props) {

  const { myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { authorID, dateCreated, commentID, text, likes,
    projectID, taskID } = props.comment
  const { setLikesUserIDs, setShowLikesModal } = props
  const [showCommentOptions, setShowCommentOptions] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const user = useUser(authorID)
  const likesNum = likes?.length
  const userHasLiked = likes?.includes(myUserID)
  const commentsPath = `organizations/${myOrgID}/projects/${projectID}/tasks/${taskID}/comments`

  const toggleLikeComment = () => {
    likeOrgProjectTaskCommentService(
      myUserID,
      userHasLiked,
      commentsPath,
      commentID,
      setToasts
    )
  }

  const initShowLikes = () => {
    setLikesUserIDs(likes)
    setShowLikesModal(true)
  }

  const editComment = () => {
    setEditMode(true)
    setEditText(text)
  }

  const cancelSaveComment = () => {
    setEditMode(false)
    setEditText('')
  }

  const updateComment = () => {
    if (!editText) return setToasts(infoToast('Please enter a comment.'))
    updateOrgProjectTaskCommentService(
      commentsPath,
      commentID,
      editText,
      setToasts, 
      setCommentLoading
    )
    .then(() => {
      cancelSaveComment()
    })
  }

  const deleteComment = () => {
    const confirm = window.confirm("Are you sure you want to delete this comment?")
    if (!confirm) return
    deleteOrgProjectTaskCommentService(
      commentsPath,
      commentID,
      setToasts,
    )
  }

  return (
    <div className="task-comment-item">
      <div className="comment-header">
        <div className="left">
          <Avatar
            dimensions={32}
            src={user?.photoURL}
            alt={`${user?.firstName} ${user?.lastName}`}
          />
          <div className="texts">
            <h5>{user?.firstName} {user?.lastName}</h5>
            <small>{convertClassicDate(dateCreated?.toDate())}</small>
          </div>
        </div>
        <DropdownIcon
          iconColor="var(--grayText)"
          icon="far fa-ellipsis-h"
          dimensions={27}
          iconSize={16}
          tooltip="Actions"
          showMenu={showCommentOptions === commentID}
          setShowMenu={setShowCommentOptions}
          onClick={() => setShowCommentOptions(showCommentOptions === commentID ? null : commentID)}
          items={[
            { label: "Edit", icon: "fas fa-pen", onClick: () => editComment() },
            { label: "Delete", icon: "fas fa-trash", onClick: () => deleteComment() },
          ]}
        />
      </div>
      <div className="comment-body">
        {
          !editMode ?
            <AppLink text={text}/> :
            <div className="editor-container">
              <WysiwygEditor
                placeholder="Enter a comment..."
                html={editText}
                setHtml={setEditText}
                className="comment-editor"
                height={100}
              />
              <div className="btn-group">
                <AppButton
                  label="Save"
                  onClick={() => updateComment()}
                  rightIcon={commentLoading && "fas fa-spinner fa-spin"}
                />
                <AppButton
                  label="Cancel"
                  onClick={() => cancelSaveComment()}
                  buttonType="invertedBtn"
                />
              </div>
            </div>
        }
        <div className="likes-section">
          <i
            className={`fa${userHasLiked ? 's' : 'r'} fa-heart`}
            onClick={() => toggleLikeComment()}
          />
          {
            likesNum > 0 &&
            <small onClick={() => initShowLikes()}>
              {likesNum} {likesNum === 1 ? "like" : "likes"}
            </small>
          }
        </div>
      </div>
    </div>
  )
}
