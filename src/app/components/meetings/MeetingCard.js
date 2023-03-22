import useUser from "app/hooks/userHooks"
import { convertClassicDate, convertClassicTime } from "app/utils/dateUtils"
import React from 'react'
import { Link } from "react-router-dom"
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import './styles/MeetingCard.css'

export default function MeetingCard(props) {

  const { title, meetingStart, meetingEnd, participants,
    isActive, organizerID, isPublic, meetingID } = props.meeting
  const organizer = useUser(organizerID)

  return (
    <Link
      className="meeting-card"
      to={`/meetings/${meetingID}`}
    >
      <div className="header">
        <IconContainer
          icon="fas fa-video"
          iconColor="#fff"
          bgColor="var(--blue)"
          dimensions={30}
          iconSize={14}
        />
        <div className="texts">
          <h5>{title}</h5>
          <h6>{participants?.length} participant{participants?.length !== 1 ? 's' : ''}</h6>
        </div>
      </div>
      <div className="organizer">
        <div className="left side">
          <Avatar
            src={organizer?.photoURL}
            dimensions={25}
          />
          <div className="texts">
            <h5>{organizer?.firstName} {organizer?.lastName}</h5>
            <h6>Organizer</h6>
          </div>
        </div>
        <div className="right side">
          {isActive && <i className="fas fa-headset" title="Live meeting" />}
          {isPublic && <i className="fas fa-globe" title="Public organization meeting" />}
        </div>
      </div>
      <div className="schedule">
        <h5>
          <i className="far fa-clock" />
          {convertClassicDate(meetingStart?.toDate())}
        </h5>
        <h6>
          <span>{convertClassicTime(meetingStart?.toDate())}</span>
          <span>-</span>
          <span>{convertClassicTime(meetingEnd?.toDate())}</span>
        </h6>
      </div>
      <div className="actions">
        <h6>
          Join Meeting
          <i className="far fa-arrow-right" />
        </h6>
        <MultipleUsersAvatars
          userIDs={participants}
          maxAvatars={6}
          avatarDimensions={25}
        />
      </div>
    </Link>
  )
}
