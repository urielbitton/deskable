import { useOrgUsersSearch } from "app/hooks/searchHooks"
import React from 'react'
import UsersSearchInput from "../ui/UsersSearchInput"

export default function OrgUsersTagInput(props) {

  const { label, query, setLoading, filters, onChange,
    value, addedUsers, onUserClick, showDropdown, 
    setShowDropdown, onFocus, onBlur, placeholder,
    iconleft } = props
  const showAll = true

  const orgUsers = useOrgUsersSearch(query, setLoading, filters, showAll)

  const filteredOrgUsers = orgUsers.filter((user) => {
    return !addedUsers.includes(user.userID)
  })

  return (
    <UsersSearchInput
      label={label}
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
    />
  )
}
