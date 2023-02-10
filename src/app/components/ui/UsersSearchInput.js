import React, { useEffect } from 'react'
import { AppInput } from "./AppInputs"
import Avatar from "./Avatar"
import './styles/UsersSearchInput.css'

export default function UsersSearchInput(props) {

  const { label, placeholder, value, onChange, users,
    showImgs = true, onUserClick, showDropdown,
    setShowDropdown, onFocus, onBlur, iconleft } = props

  const usersRender = users?.map((user) => {
    return <div
      key={user.userID}
      className="user-row"
      onClick={(e) => onUserClick(e, user)}
    >
      {
        showImgs &&
        <Avatar
          src={user.photoURL}
          dimensions={35}
          alt={`${user.firstName} ${user.lastName}`}
        />
      }
      <h6>{user.firstName} {user.lastName}</h6>
    </div>
  })

  useEffect(() => {
    if (showDropdown) {
      window.onclick = (e) => setShowDropdown(false)
    }
    return () => window.onclick = null
  }, [showDropdown])

  return (
    <div
      className="users-search-input"
      onClick={(e) => e.stopPropagation()}
    >
      <AppInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        iconleft={iconleft}
      />
      <div
        className={`users-results-list ${showDropdown ? 'show' : 'hide'}`}
      >
        {usersRender}
      </div>
    </div>
  )
}
