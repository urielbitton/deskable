import { infoToast } from "app/data/toastsTemplates"
import {
  addMeetingInfoToEventService, createCalendarEventService,
  deleteCalendarEventService, updateCalendarEventService
} from "app/services/calendarServices"
import { StoreContext } from "app/store/store"
import {
  convertClassicDate, convertDateToInputDateAndTimeFormat
} from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppSwitch, AppTextarea } from "../ui/AppInputs"
import './styles/NewEventModal.css'
import useUser from "app/hooks/userHooks"
import Avatar from "../ui/Avatar"
import DropdownSearch from "../ui/DropdownSearch"
import { useUsersSearch } from "app/hooks/searchHooks"
import { createMeetingService } from "app/services/meetingsServices"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sendEventInvitesEmails } from "app/services/emailServices"

export default function NewEventModal() {

  const { newEventModal, setNewEventModal, myUserID,
    setToasts, setPageLoading, myOrgID, myMemberType,
    myUser } = useContext(StoreContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startingDate, setStartingDate] = useState('')
  const [endingDate, setEndingDate] = useState('null')
  const [inviteesIDs, setInviteesIDs] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [createMeetingLoading, setCreateLoading] = useState(false)
  const [createVideoMeeting, setCreateVideoMeeting] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef = useRef(null)
  const editMode = newEventModal?.event?.eventID
  const searchFilters = `activeOrgID: ${myOrgID} AND NOT userID: ${myUserID} ${editMode ? `AND NOT userID: ${inviteesIDs?.join(' AND NOT userID: ')}` : ''}`
  const orgUsers = useUsersSearch(query, setSearchLoading, searchFilters, false)
  const allowSave = title && description && startingDate && endingDate
  const isCreator = newEventModal?.event?.creatorID === myUserID
  const navigate = useNavigate()

  const handleRemoveInvitee = (inviteeID) => {
    if (!isCreator) return setToasts(infoToast('You do not have permission to remove this user.'))
    const confirm = window.confirm('Are you sure you want to remove this user?')
    if (!confirm) return null
    if (isCreator || inviteeID === myUserID) {
      updateCalendarEventService(
        myOrgID,
        newEventModal?.event?.eventID,
        {
          title,
          description,
          startingDate: new Date(startingDate),
          endingDate: new Date(endingDate),
          invitees: inviteesIDs.filter(id => id !== inviteeID)
        },
        setToasts,
        setPageLoading
      )
        .then(() => {
          setSelectedUsers([])
          setInviteesIDs(prev => prev.filter(id => id !== inviteeID))
        })
    }
  }

  const inviteesList = inviteesIDs?.map((inviteeID) => {
    return <EventInvitee
      key={inviteeID}
      inviteeID={inviteeID}
      onCloseClick={() => handleRemoveInvitee(inviteeID)}
    />
  })

  const handleSelectUser = (user) => {
    setSelectedUsers(prev => [...prev, user])
    setQuery('')
    inputRef?.current?.focus()
  }

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

  const createEvent = async () => {
    if (!!!allowSave) return setToasts(infoToast('Please fill all the fields.'))
    const confirm = window.confirm('Creating an event will send out an email to all invitees. Continue?')
    if (!confirm) return null
    const res = await createCalendarEventService(
      myOrgID,
      myUserID,
      selectedUsers?.map(user => user.userID),
      {
        title,
        description,
        startingDate: new Date(startingDate),
        endingDate: new Date(endingDate),
      },
      createVideoMeeting,
      setToasts,
      setPageLoading
    )
    setNewEventModal({ open: false, event: null })
    setSelectedUsers([])
    const { meetingID, roomID } = res
    await sendEventInvitesEmails({
      users: [...selectedUsers, myUser]?.map(user => ({ name: `${user.firstName} ${user.lastName}`, email: user.email })),
      title,
      dates: { 
        startingDate: new Date(startingDate),
        endingDate: new Date(endingDate)
      },
      description,
      meeting: { meetingID, roomID }
    })
  }

  const saveEvent = () => {
    if (newEventModal?.event?.creatorID !== myUserID)
      return setToasts(infoToast('You cannot edit this event.'))
    updateCalendarEventService(
      myOrgID,
      newEventModal?.event?.eventID,
      {
        title,
        description,
        startingDate: new Date(startingDate),
        endingDate: new Date(endingDate),
        invitees: [...inviteesIDs, ...selectedUsers?.map(user => user.userID)]
      },
      setToasts,
      setPageLoading
    )
      .then(() => {
        setSelectedUsers([])
        setNewEventModal({ open: false, event: null })
      })
  }

  const handleSaveAndClose = () => {
    editMode ? saveEvent() : createEvent()
  }

  const deleteEvent = () => {
    if (newEventModal.event.creatorID !== myUserID) return setToasts(infoToast('You cannot remove this event.'))
    const confirm = window.confirm('Are you sure you want to delete this event?')
    if (!confirm) return setToasts(infoToast('Event not deleted.'))
    deleteCalendarEventService(
      myOrgID,
      newEventModal.event.eventID,
      setToasts,
      setPageLoading
    )
      .then(() => {
        setNewEventModal({ open: false, event: null })
      })
  }

  const handleStartVideoCall = () => {
    if (newEventModal?.event?.meetingID) {
      setNewEventModal({ open: false, event: null })
      return navigate(`/meetings/meeting-room/${newEventModal?.event?.meetingID}?roomID=${newEventModal?.event?.roomID}`)
    }
    if (myMemberType !== 'classa') {
      return alert('You do not have permission to create meetings. Please contact your organization admin.')
    }
    if (createMeetingLoading) return
    setCreateLoading(true)
    createMeetingService(
      myOrgID,
      {
        invitees: inviteesIDs,
        isPublic: false,
        meetingEnd: new Date(endingDate),
        meetingStart: new Date(startingDate),
        organizerID: myUserID,
        title,
      },
      setCreateLoading,
      setToasts
    )
      .then((res) => {
        // @ts-ignore
        const { meetingID, roomID } = res
        return addMeetingInfoToEventService(
          myOrgID,
          newEventModal?.event?.eventID,
          meetingID,
          roomID,
        )
          .then(() => {
            setNewEventModal({ open: false, event: null })
            setCreateLoading(false)
            navigate(`/meetings/meeting-room/${meetingID}?roomID=${roomID}`)
          })
      })
      .catch(() => {
        setCreateLoading(false)
      })
  }

  const handleCloseModal = (e) => {
    setNewEventModal({ open: false, event: null })
    setSearchParams({ })
  }

  useEffect(() => {
    if (newEventModal.event) {
      setTitle(newEventModal?.event?.title)
      setDescription(newEventModal?.event?.description)
      setInviteesIDs(newEventModal?.event?.invitees)
      setStartingDate(convertDateToInputDateAndTimeFormat((newEventModal?.event?.startingDate)))
      setEndingDate(convertDateToInputDateAndTimeFormat((newEventModal?.event?.endingDate)))
    }
  }, [newEventModal])

  useEffect(() => {
    
  },[])


  return (
    <div
      className={`new-event-modal ${newEventModal.open ? 'show' : ''}`}
      onMouseDown={handleCloseModal}
    >
      <div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="titles">
          <div className="left-side">
            <h4>{editMode ? newEventModal?.event?.title : "New Event"}</h4>
            {editMode && <h6>{convertClassicDate(newEventModal?.event?.startingDate)}</h6>}
          </div>
          <div className="right-side">
            {
              editMode &&
              <AppButton
                title="Join Meeting"
                onClick={handleStartVideoCall}
                leftIcon="fas fa-video"
                iconBtn
                loading={createMeetingLoading}
              />
            }
          </div>
        </div>
        <AppInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <AppTextarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="invitees-section">
          <h5>Guests</h5>
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
          <div className="invitees-list">
            {inviteesList}
          </div>
        </div>
        <AppInput
          label="Starting Date"
          type="datetime-local"
          value={startingDate}
          onChange={(e) => setStartingDate((e.target.value))}
        />
        <AppInput
          label="Ending Date"
          type="datetime-local"
          value={endingDate}
          onChange={(e) => setEndingDate((e.target.value))}
        />
        <h5>Meet</h5>
        {
          editMode ?
            <AppButton
              label="Join Meeting"
              onClick={handleStartVideoCall}
              leftIcon="fas fa-video"
              buttonType="blueBtn"
            /> :
            myMemberType === 'classa' ?
            <AppSwitch
              label={<><i className="fas fa-video" /> Create Video Meeting</>}
              onChange={(e) => setCreateVideoMeeting(e.target.checked)}
              checked={createVideoMeeting}
            /> :
            null
        }
        <div className="btn-group">
          <AppButton
            label="Save & Close"
            onClick={handleSaveAndClose}
            disabled={!!!allowSave}
          />
          <AppButton
            label="Cancel"
            buttonType="outlineBtn"
            onClick={() => setNewEventModal({ open: false, event: null })}
          />
          {
            newEventModal?.event?.editMode &&
            <AppButton
              label="Delete"
              buttonType="outlineRedBtn"
              onClick={() => deleteEvent()}
            />
          }
        </div>
      </div>
    </div>
  )
}

export const EventInvitee = ({ inviteeID, onCloseClick }) => {

  const invitee = useUser(inviteeID)

  return (
    <div className="invitee-item">
      <Avatar
        src={invitee?.photoURL}
        dimensions={25}
        round={false}
      />
      <h6>{invitee?.firstName} {invitee?.lastName}</h6>
      <div
        className="close"
        onClick={onCloseClick}
      >
        <i className="fal fa-times" />
      </div>
    </div>
  )
}