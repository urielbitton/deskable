import { useUsers } from "app/hooks/userHooks"
import React from 'react'
import { useNavigate } from "react-router-dom"
import Avatar from "./Avatar"
import './styles/MultipleUsersAvatars.css'

export default function MultipleUsersAvatars(props) {

  const { userIDs, maxAvatars, avatarDimensions } = props
  const avatarUsers = useUsers(userIDs)
  const navigate = useNavigate()

  const avatarRows = avatarUsers
    ?.slice(0, maxAvatars)
    .map((user, index) => {
      return <Avatar
        key={index}
        src={user.photoURL}
        dimensions={avatarDimensions}
        border="2px solid #fff"
        onClick={() => navigate(`/profile/${user.userID}`)}
        alt={user.firstName}
        title={`${user.firstName} ${user.lastName}`}
      />
    })

  return (
    <div className="multiple-users-avatars">
      {avatarRows}
      {
        avatarUsers?.length > maxAvatars &&
        <div
          className="more-avatars-circle"
          style={{ width: avatarDimensions, height: avatarDimensions }}
        >
          +${avatarUsers.length - maxAvatars}
        </div>
      }
    </div>
  )
}