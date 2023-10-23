import React, { useContext, useRef, useState } from 'react'
import './styles/ChatHeader.css'
import IconContainer from "../ui/IconContainer"
import { useChat, useSpaceChat } from "app/hooks/chatHooks"
import { StoreContext } from "app/store/store"
import { useParams } from "react-router-dom"
import Avatar from "../ui/Avatar"
import useUser from "app/hooks/userHooks"
import AppModal from "../ui/AppModal"
import AppButton from "../ui/AppButton"
import { useUsersSearch } from "app/hooks/searchHooks"
import DropdownSearch from "../ui/DropdownSearch"

export default function ChatHeader() {

  const { myUserID, myOrgID, spaceChatDefaultImg } = useContext(StoreContext)
  const conversationID = useParams().conversationID
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [query, setQuery] = useState('')
  const singleChat = useChat(myUserID, conversationID)
  const spaceChat = useSpaceChat(myOrgID, conversationID)
  const chat = { ...singleChat, ...spaceChat }
  const isSpaceChat = chat?.type === "space"
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const otherParticipant = useUser(!isSpaceChat ? otherParticipantID : null)
  const searchFilters = `activeOrgID: ${myOrgID} AND NOT userID: ${myUserID}`
  const orgUsers = useUsersSearch(query, setSearchLoading, searchFilters, false)
  const inputRef = useRef(null)

  const handleAddParticipants = () => {

  }

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

  return (
    <div
      className="chat-header"
      key={conversationID}
    >
      <div className="left-side">
        <Avatar
          src={!isSpaceChat ? otherParticipant?.photoURL : spaceChatDefaultImg}
          dimensions={38}
        />
        <div className="text">
          <h5>{!isSpaceChat ? `${otherParticipant?.firstName} ${otherParticipant?.lastName}` : chat?.spaceName}</h5>
          <small>Active now</small>
        </div>
      </div>
      <div className="right-side">
        <IconContainer
          icon="far fa-user-plus"
          onClick={() => setShowAddParticipantModal(true)}
          iconSize={15}
          iconColor="var(--grayText)"
          round={false}
        />
        <IconContainer
          icon="far fa-info-circle"
          onClick={() => console.log("info")}
          iconSize={17}
          iconColor="var(--grayText)"
          round={false}
        />
      </div>
      <AppModal
        label="Add Participant"
        showModal={showAddParticipantModal}
        setShowModal={setShowAddParticipantModal}
        actions={
          <AppButton
            label="Add"
            onClick={handleAddParticipants}
          />
        }
      >
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
            setShowSearchDropdown={()=>null}
            searchLoading={searchLoading}
            clearSearch={() => setQuery('')}
            inputRef={inputRef}
          />
        </div>
      </AppModal>
    </div>
  )
}
