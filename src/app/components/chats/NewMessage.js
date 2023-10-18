import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles/NewMessage.css'
import { useUsersSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import DropdownSearch from "../ui/DropdownSearch"
import Avatar from "../ui/Avatar"
import ChatConsole from "./ChatConsole"
import { hasWhiteSpace } from "app/utils/generalUtils"

export default function NewMessage() {

  const { myOrgID } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [messageString, setMessageString] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const searchFilters = `activeOrgID: ${myOrgID}`
  const orgUsers = useUsersSearch(query, setSearchLoading, searchFilters, false)
  const inputRef = useRef(null)

  const handleSelectUser = (user) => {
    setSelectedUsers(prev => [...prev, user])
    setQuery('')
    inputRef?.current?.focus()
  }

  const orgUsersList = orgUsers
    ?.filter((user) => !selectedUsers?.some(selectedUser => selectedUser.userID === user.userID))
    .map((user) => {
      return <div
        key={user.userID}
        className="result-item"
        onClick={() => handleSelectUser(user)}
      >
        <Avatar
          src={user.photoURL}
          dimensions={25}
          round={false}
        />
        <h6>{`${user.firstName} ${user.lastName}`}</h6>
      </div>
    })

  const selectedUsersList = selectedUsers
    ?.filter((user) => user?.userID)
    .map((user) => {
      return <div
        key={user?.userID}
        className="selected-user-bubble"
      >
        <Avatar
          src={user.photoURL}
          dimensions={25}
          round={false}
        />
        <h6>{`${user.firstName} ${user.lastName}`}</h6>
        <div className="close">
          <i
            className="fal fa-times"
            onClick={() => setSelectedUsers(prev => prev.filter(prevUser => prevUser.userID !== user.userID))}
          />
        </div>
      </div>
    })

  const handleClearSearch = () => {
    setQuery('')
    setShowSearchDropdown(false)
  }

  const handleSendMessage = () => {
    if(hasWhiteSpace(messageString) || selectedUsers.length < 1) return null
    if(selectedUsers.length > 1) {
      // create group chat
    }
    else {
      // create single chat
    }
  }

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  return (
    <div className="new-message-container">
      <div className="new-message-header">
        <div className="title-bar">
          <h4>New Message</h4>
        </div>
        <div className="compose-bar">
          <h5>To:</h5>
          {
            selectedUsers?.length > 0 &&
            <div className="selected-users-flex">
              {selectedUsersList}
            </div>
          }
          <DropdownSearch
            placeholder="Search users or spaces"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            searchResults={orgUsersList}
            showSearchDropdown={query.length > 0}
            setShowSearchDropdown={setShowSearchDropdown}
            searchLoading={searchLoading}
            clearSearch={() => handleClearSearch()}
            inputRef={inputRef}
          />
        </div>
      </div>
      <div className="console-section">
        <ChatConsole
          inputPlaceholder="Type a message..."
          value={messageString}
          onChange={(e) => setMessageString(e.target.value)}
          onSendBtnClick={handleSendMessage}
          sendLoading={sendLoading}
        />
      </div>
    </div>
  )
}
