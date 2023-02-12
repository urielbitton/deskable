import React, { useEffect } from 'react'
import Avatar from "./Avatar"
import './styles/UsersSearchInput.css'

export default function UsersSearchInput(props) {

  const { label, placeholder, value, onChange, users,
    showImgs = true, onUserClick, showDropdown,
    setShowDropdown, onFocus, onBlur, iconleft,
    name, tag, selectedUser } = props

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
    if (showDropdown === name) {
      window.onclick = (e) => setShowDropdown(null)
    }
    return () => window.onclick = null
  }, [showDropdown])

  return (
    <div
      className="users-search-input"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <label className="appInput commonInput">
        {label && <h6>{label}</h6>}
        {
          tag && selectedUser ?
            <div 
              className="selected-user"
              onClick={(e) => setShowDropdown(name)}
            >
              <Avatar
                src={selectedUser?.photoURL}
                dimensions={30}
              />
              <h6>{selectedUser?.firstName} {selectedUser?.lastName}</h6>
            </div> :
            <div className="input-wrapper">
              <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              {iconleft}
            </div>
        }
      </label>
      <div
        className={`users-results-list ${showDropdown === name ? 'show' : 'hide'}`}
      >
        {usersRender}
      </div>
    </div>
  )
}
