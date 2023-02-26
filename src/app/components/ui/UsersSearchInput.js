import { noWhiteSpaceChars } from "app/utils/generalUtils"
import React, { useEffect } from 'react'
import Avatar from "./Avatar"
import IconContainer from "./IconContainer"
import MultipleUsersAvatars from "./MultipleUsersAvatars"
import './styles/UsersSearchInput.css'

export default function UsersSearchInput(props) {

  const { label, placeholder, value, onChange, users,
    showImgs = true, onUserClick, showDropdown,
    setShowDropdown, onFocus, onBlur, iconleft,
    name, tag, selectedUsers, multiple,
    onUserRemove, maxAvatars, onClear, inputSubtitle,
    showAll, typeSearch } = props

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

  const inputWrapper = (
    <div className="input-wrapper">
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {iconleft}
      {inputSubtitle}
    </div>
  )

  const handleClear = (e) => {
    e.stopPropagation()
    onClear()
  }

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
          !typeSearch ?
            tag && selectedUsers?.filter(user => user).length > 0 ?
              !multiple ?
                <div
                  className="selected-user"
                  onClick={() => setShowDropdown(prev => prev === name ? null : name)}
                >
                  <Avatar
                    src={selectedUsers[0]?.photoURL}
                    dimensions={29}
                  />
                  <h6>{selectedUsers[0]?.firstName} {selectedUsers[0]?.lastName}</h6>
                  {
                    onClear &&
                    <IconContainer
                      icon="far fa-times"
                      bgColor="var(--inputBg)"
                      iconColor="var(--grayText)"
                      dimensions={23}
                      iconSize={16}
                      onClick={handleClear}
                    />
                  }
                </div>
                :
                <div
                  className="selected-user"
                  onClick={() => setShowDropdown(name)}
                >
                  <MultipleUsersAvatars
                    userIDs={selectedUsers?.map((user) => user?.userID)}
                    maxAvatars={maxAvatars}
                    avatarDimensions={29}
                    enableEditing
                    onUserClick={(user) => onUserRemove(user)}
                  />
                  {
                    onClear && <small
                      className="clear-text"
                      onClick={handleClear}
                    >
                      Clear
                    </small>
                  }
                </div>
              :
              inputWrapper :
            inputWrapper
        }
      </label>
      <div
        className={`users-results-list ${showDropdown === name ? 'show' : 'hide'} ${!showAll && !noWhiteSpaceChars(value) ? 'hide' : ''}`}
      >
        <small className="dropdown-title">
          <i className="fas fa-user-plus" />
          Add User
        </small>
        {usersRender}
        {
          users?.length === 0 &&
          <small className="no-more-users">
            <i className="fas fa-exclamation-circle" />
            No users found.
          </small>
        }
      </div>
    </div>
  )
}
