import { useOrgUsersSearch } from "app/hooks/searchHooks"
import React from 'react'
import UsersSearchInput from "../ui/UsersSearchInput"

export default function OrgUsersTagInput(props) {

  const { label, query, setLoading, filters, onChange,
    value, selectedUser, onUserClick, showDropdown, 
    setShowDropdown, onFocus, onBlur, placeholder,
    iconleft, name } = props
  const showAll = true

  const orgUsers = useOrgUsersSearch(query, setLoading, filters, showAll)

  const filteredOrgUsers = orgUsers.filter((user) => {
    return user?.userID !== selectedUser?.userID
  })

  return (
    <UsersSearchInput
      label={label}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      users={filteredOrgUsers}
      showImgs
      onUserClick={onUserClick}
      showDropdown={showDropdown}
      setShowDropdown={setShowDropdown}
      onFocus={onFocus}
      onBlur={onBlur}
      iconleft={iconleft}
      selectedUser={selectedUser}
      tag
    />
  )
}
