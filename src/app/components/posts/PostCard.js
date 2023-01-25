import useUser from "app/hooks/userHooks"
import { getTimeAgo } from "app/utils/dateUtils"
import React, { useState } from 'react'
import AppCard from "../ui/AppCard"
import Avatar from "../ui/Avatar"
import DropdownIcon from "../ui/DropDownIcon"
import './styles/PostCard.css'

export default function PostCard(props) {

  const { authorID, dateCreated, postID, postText } = props.post
  const [showPostOptions, setShowPostOptions] = useState(false)
  const postAuthor = useUser(authorID)

  const editPost = () => {

  }

  const deletePost = () => {

  }

  const bookmarkPost = () => {

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
              { label: "Edit", icon: "fas fa-pen", onClick: () => editPost()},
              { label: "Delete", icon: "fas fa-trash", onClick: () => deletePost()},
              { label: "Save Post", icon: "fas fa-bookmark", onClick: () => bookmarkPost()},
            ]}
          />
        </div>
      </div>
      <div className="content">
        <p>{postText}</p>
        <div className="user-actions">
          <div>
            <i className="far fa-comment" />
            <h6>Comments</h6>
          </div>
          <div>
            <i className="far fa-heart" />
            <h6>Likes</h6>
          </div>
          <div>
            <i className="far fa-bookmark" />
            <h6>Saved</h6>
          </div>
        </div>
      </div>
    </AppCard>
  )
}