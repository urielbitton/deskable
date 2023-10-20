import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles/NewMessage.css'
import { useUsersSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import DropdownSearch from "../ui/DropdownSearch"
import Avatar from "../ui/Avatar"
import ChatConsole from "./ChatConsole"
import { hasWhiteSpace } from "app/utils/generalUtils"
import { createConversationService } from "app/services/chatServices"
import { AppInput } from "../ui/AppInputs"
import { useNavigate } from "react-router-dom"

export default function NewMessage() {

  const { myOrgID, myUser, myUserID } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [spaceName, setSpaceName] = useState('')
  const [messageString, setMessageString] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const searchFilters = `activeOrgID: ${myOrgID} AND NOT userID: ${myUserID}`
  const orgUsers = useUsersSearch(query, setSearchLoading, searchFilters, false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const isSpaceChat = selectedUsers.length > 1

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
        <div
          className="close"
          onClick={() => setSelectedUsers(prev => prev.filter(prevUser => prevUser.userID !== user.userID))}
        >
          <i className="fal fa-times" />
        </div>
      </div>
    })

  const handleClearSearch = () => {
    setQuery('')

  }

  const handleSendMessage = () => {
    if (selectedUsers.length < 1) return alert('Please select at least one user to send to.')
    if(hasWhiteSpace(messageString)) return alert('Please add a message to send.')
    setSendLoading(true)
    createConversationService({
      selectedUsersIDs: selectedUsers.map(user => user.userID),
      messageMeta: {
        dateSent: new Date(),
        senderID: myUserID,
        text: messageString,
      },
      spaceName,
      userMeta: {
        userID: myUserID,
        userName: `${myUser?.firstName} ${myUser?.lastName}`,
        userImg: myUser?.photoURL,
      },
      orgID: myOrgID,
      participantID: selectedUsers[0]?.userID,
      isSpaceChat
    })
      .then((res) => {
        setSendLoading(false)
        if (res.success) {
          return navigate(`/messages/${res.conversationID}`)
        }
        return alert('There was a problem creating your space. Please try again.')
      })
      .catch((err) => {
        console.log(err)
        setSendLoading(false)
      })
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
        {
          isSpaceChat &&
          <AppInput
            label="Space Name"
            placeholder="Name your space"
            onChange={(e) => setSpaceName(e.target.value)}
            value={spaceName}
            disabled={sendLoading}
          />
        }
        <ChatConsole
          inputPlaceholder="Type a message to send to this space"
          value={messageString}
          onChange={(e) => setMessageString(e.target.value)}
          onSendBtnClick={handleSendMessage}
          sendLoading={sendLoading}
          showEmojiPicker={showEmojiPicker}
        />
      </div>
    </div>
  )
}
