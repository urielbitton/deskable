import { useOrgUsersSearch } from "app/hooks/searchHooks"
import React from 'react'
import UsersSearchInput from "../ui/UsersSearchInput"

export default function OrgUsersTagInput(props) {

  const { label, query, setLoading, filters, onChange,
    value, selectedUsers, onUserClick, onUserRemove, 
    showDropdown, setShowDropdown, onFocus, onBlur, 
    placeholder, iconleft, name, multiple } = props
  const showAll = true

  const orgUsers = useOrgUsersSearch(query, setLoading, filters, showAll)

  const filteredOrgUsers = orgUsers.filter((user) => {
    return !selectedUsers?.find((selectedUser) => selectedUser?.userID === user?.userID)
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
      onUserRemove={onUserRemove}
      showDropdown={showDropdown}
      setShowDropdown={setShowDropdown}
      onFocus={onFocus}
      onBlur={onBlur}
      iconleft={iconleft}
      selectedUsers={selectedUsers}
      tag
      multiple={multiple}
    />
  )
}
