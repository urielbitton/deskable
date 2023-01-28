import useUser from "app/hooks/userHooks"
import { getTimeAgo } from "app/utils/dateUtils"
import React from 'react'
import Avatar from "../ui/Avatar"
import './styles/CommentItem.css'

export default function CommentItem(props) {

  const { commentText, dateCreated, likes, authorID, file } = props.comment
  const author = useUser(authorID)
  const hasImg = file?.type?.includes('image')
  const likesNum = likes?.length

  return author && (
    <div className="comment-item">
      <div className="left-side">
        <Avatar
          src={author?.photoURL}
          dimensions={27}
        />
      </div>
      <div className="right-side">
        <div className="comment-bubble">
          <h6>{author.firstName} {author.lastName}</h6>
          <p>{commentText}</p>
          {
            hasImg &&
            <img
              src={file.url}
              alt="comment-img"
            />
          }
        </div>
        <div className="comment-actions">
          <small>Like</small>
          <small>Reply</small>
          <small className="no-underline">
            <span>{getTimeAgo(dateCreated?.toDate())}</span>
          </small>
        </div>
      </div>
    </div>
  )
}
