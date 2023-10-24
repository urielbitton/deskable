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
import { addParticipantsToChatService, removeChatParticipantService } from "app/services/chatServices"

export default function ChatHeader() {

  const { myUserID, myOrgID, spaceChatDefaultImg,
    myMemberType } = useContext(StoreContext)
  const conversationID = useParams().conversationID
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [query, setQuery] = useState('')
  const singleChat = useChat(myUserID, conversationID)
  const spaceChat = useSpaceChat(myOrgID, conversationID)
  const chat = { ...singleChat, ...spaceChat }
  const isSpaceChat = chat?.type === "space"
  const participantsIDs = chat?.participantsIDs
  const otherParticipantID = myUserID === chat?.participantID ? chat?.creatorID : chat?.participantID
  const otherParticipant = useUser(!isSpaceChat ? otherParticipantID : null)
  const searchFilters = `activeOrgID: ${myOrgID} AND NOT userID: ${participantsIDs?.join(' AND NOT userID: ')}`
  const orgUsers = useUsersSearch(query, setSearchLoading, searchFilters, false)
  const inputRef = useRef(null)
  const firstTwoParticipantsIDs = participantsIDs
    ?.filter((participantID) => participantID !== myUserID)
    .slice(0, 2)
  const firstParticipant = useUser(firstTwoParticipantsIDs?.[0])
  const secondParticipant = useUser(firstTwoParticipantsIDs?.[1])
  const firstParticipantName = `${firstParticipant?.firstName} ${firstParticipant?.lastName}`
  const secondParticipantName = `${secondParticipant?.firstName} ${secondParticipant?.lastName}`

  const handleRemoveParticipant = (participantID) => {
    const isMe = participantID === myUserID
    if (myMemberType !== 'classa' && !isMe) return alert('You do not have permission to remove participants. Only admins can remove participants.')
    if (isMe || myMemberType === 'classa') {
      const confirm = window.confirm('Are you sure you want to remove this participant?')
      if (!confirm) return null
      removeChatParticipantService({
        orgID: myOrgID,
        conversationID,
        participantID,
        participantsIDs
      })
    }
  }

  const allParticipantsList = participantsIDs?.map((participantID) => {
    return <ParticipantItem
      key={participantID}
      participantID={participantID}
      onRemove={() => handleRemoveParticipant(participantID)}
    />
  })

  const handleAddParticipants = () => {
    if (!selectedUsers?.length) return null
    setAddLoading(true)
    addParticipantsToChatService({
      orgID: myOrgID,
      conversationID,
      participantsIDs,
      addedIDs: selectedUsers?.map(user => user.userID)
    })
      .then(() => {
        setShowAddParticipantModal(false)
        setSelectedUsers([])
        setAddLoading(false)
      })
      .catch(err => {
        setAddLoading(false)
        alert('Something went wrong. Please try again later.')
      })
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
          <h5>
            {
              !isSpaceChat ?
                `${otherParticipant?.firstName} ${otherParticipant?.lastName}` :
                <>{chat?.spaceName} <span>({firstParticipantName},&nbsp;
                  {secondParticipantName} {participantsIDs?.length > 2 ? `and ${participantsIDs?.length - 2} other${participantsIDs?.length > 3 ? 's' : ''}` : ''})</span></>
            }
          </h5>
          <small>Active now</small>
        </div>
      </div>
      <div className="right-side">
        {
          isSpaceChat &&
          <IconContainer
            icon="far fa-user-plus"
            onClick={() => setShowAddParticipantModal(true)}
            iconSize={15}
            iconColor="var(--grayText)"
            round={false}
          />
        }
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
        portalClassName="add-participants-modal"
        actions={
          <AppButton
            label="Add"
            onClick={handleAddParticipants}
            loading={addLoading}
          />
        }
      >
        <div className="compose-bar">
          {
            selectedUsers?.length > 0 &&
            <div className="selected-users-flex">
              {selectedUsersList}
            </div>
          }
          <DropdownSearch
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            searchResults={orgUsersList}
            showSearchDropdown={query.length > 0}
            setShowSearchDropdown={() => null}
            searchLoading={searchLoading}
            clearSearch={() => setQuery('')}
            inputRef={inputRef}
          />
        </div>
        <div className="participants-list">
          <h5>Participants</h5>
          {allParticipantsList}
        </div>
      </AppModal>
    </div>
  )
}

export const ParticipantItem = ({ participantID, onRemove }) => {

  const participant = useUser(participantID)

  return <div
    className="participant-item"
    key={participantID}
  >
    <Avatar
      src={participant?.photoURL}
      dimensions={30}
      round={false}
    />
    <h6>{`${participant?.firstName} ${participant?.lastName}`}</h6>
    <div
      className="close"
      onClick={onRemove}
    >
      <i className="fal fa-times" />
    </div>
  </div>
} 