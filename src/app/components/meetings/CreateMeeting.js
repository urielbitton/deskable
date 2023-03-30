import { useUsers } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import OrgUsersTagInput from "../projects/OrgUsersTagInput"
import AppButton from "../ui/AppButton"
import { AppInput, AppSwitch } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import newProjectBlob from 'app/assets/images/new-project-blob.svg'
import videoMeetingImg from 'app/assets/images/new-meeting-img.png'
import './styles/CreateMeeting.css'
import { createMeetingService } from "app/services/meetingsServices"
import { convertDateToInputDateAndTimeFormat } from "app/utils/dateUtils"
import { useNavigate } from "react-router-dom"
import { infoToast } from "app/data/toastsTemplates"

export default function CreateMeeting() {

  const { myOrgID, myUserID, setToasts } = useContext(StoreContext)
  const [meetingName, setMeetingName] = useState("")
  const [invitesQuery, setInvitesQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [showCoverInput, setShowCoverInput] = useState(null)
  const [inviteesIDs, setInviteesIDs] = useState([])
  const [createLoading, setCreateLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [meetingStart, setMeetingStart] = useState(new Date())
  const [meetingEnd, setMeetingEnd] = useState(new Date(new Date().getTime() + 60 * 60 * 1000))
  const orgAlgoliaFilters = `activeOrgID:${myOrgID} AND NOT userID:${myUserID}`
  const inviteesUsers = useUsers(inviteesIDs)
  const navigate = useNavigate()

  const allowCreate = (
    meetingName.length > 3
    && meetingStart < meetingEnd
  )

  const invitedUsersList = inviteesUsers?.map((user, index) => {
    return <div
      className="invited-user"
      key={index}
    >
      <div className="texts">
        <Avatar
          src={user?.photoURL}
          dimensions={27}
        />
        <h6>{user?.firstName} {user?.lastName}</h6>
      </div>
      <IconContainer
        icon="fal fa-times"
        onClick={() => removeInvite(user)}
        iconColor="var(--grayText)"
        iconSize={19}
        dimensions={25}
      />
    </div>
  })

  const inviteUser = (e, user) => {
    e.preventDefault()
    setInviteesIDs(prev => [...prev, user.userID])
  }

  const removeInvite = (user) => {
    setInviteesIDs(prev => prev.filter(id => id !== user.userID))
  }

  const clearInvites = () => {
    setInviteesIDs([])
  }

  const createMeeting = () => {
    if(allowCreate) return 
    createMeetingService(
      myOrgID,
      {
        isPublic,
        meetingEnd: new Date(meetingEnd),
        meetingStart: new Date(meetingStart),
        organizerID: myUserID,
        title: meetingName,
      }, 
      setCreateLoading, 
      setToasts
    )
    .then(() => {
      navigate('/meetings')
    })
  }

  useEffect(() => {

  },[])

  return (
    <div className="create-meeting-page">
      <div className="content">
        <div className="form-container">
          <h3>Create Meeting</h3>
          <div className="form">
            <AppInput
              label="Meeting Name *"
              placeholder="Enter a meeting Name"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              maxLength={30}
            />
            <div className="full-row">
              <AppInput
                label="Meeting Start"
                type="datetime-local"
                onChange={(e) => setMeetingStart(e.target.value)}
                value={convertDateToInputDateAndTimeFormat(meetingStart)}
              />
              <AppInput
                label="Meeting End"
                type="datetime-local"
                onChange={(e) => setMeetingEnd(e.target.value)}
                value={convertDateToInputDateAndTimeFormat(meetingEnd)}
              />
            </div>
            <AppSwitch
              label="Public Meeting"
              checked={isPublic}
              onChange={() => setIsPublic(prev => !prev)}
            />
            <OrgUsersTagInput
              label="Invite Members"
              name="invites"
              placeholder="Invite members..."
              value={invitesQuery}
              query={invitesQuery}
              onChange={(e) => setInvitesQuery(e.target.value)}
              setLoading={setSearchLoading}
              filters={orgAlgoliaFilters}
              onUserClick={(e, user) => inviteUser(e, user)}
              onUserRemove={(user) => removeInvite(user)}
              onFocus={() => setShowCoverInput('invites')}
              showDropdown={showCoverInput}
              setShowDropdown={setShowCoverInput}
              iconleft={<div className="icon"><i className="far fa-user" /></div>}
              selectedUsers={inviteesUsers}
              multiple={inviteesIDs?.length > 1}
              maxAvatars={10}
              onClear={() => clearInvites()}
              showAll={false}
              typeSearch
            />
            {
              inviteesUsers?.length > 0 &&
              <div className="invited-users-list">
                {invitedUsersList}
              </div>
            }
          </div>
          <div className="btn-group">
            <AppButton
              label="Create"
              onClick={() => createMeeting()}
              loading={createLoading}
              disabled={!allowCreate}
            />
          </div>
        </div>
        <div className="art">
          <div className="blob-container">
            <img
              src={newProjectBlob}
              className="blob"
            />
            <img
              src={videoMeetingImg}
              alt="New Project"
              className="new-project-img"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
