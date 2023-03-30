import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import './styles/MeetingsHome.css'
import { useLiveMeetings, useRangedMeetings } from 'app/hooks/meetingsHooks'
import MeetingCard from "./MeetingCard"
import {
  endOfDay, endOfMonth, endOfWeek,
  startOfDay, startOfMonth, startOfWeek
} from "date-fns"
import { StoreContext } from "app/store/store"

export default function MeetingsHome() {

  const { myMemberType } = useContext(StoreContext)
  const limitsNum = 10
  const [meetingLimits, setMeetingLimits] = useState(limitsNum)
  const todayStart = startOfDay(new Date())
  const todayEnd = endOfDay(new Date())
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())
  const liveMeetings = useLiveMeetings(meetingLimits)
  const monthMeetings = useRangedMeetings(monthStart, monthEnd, meetingLimits)
  const canCreateMeeting = myMemberType === 'classa' || myMemberType === 'classb'

  const liveMeetingsList = liveMeetings?.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
    />
  })

  const todayMeetingsList = monthMeetings
    ?.filter(meeting => {
      return meeting.meetingStart?.toDate() >= todayStart && meeting.meetingStart?.toDate() <= todayEnd
        && !meeting.isActive
    })
    .map((meeting, index) => {
      return <MeetingCard
        key={index}
        meeting={meeting}
      />
    })

  const weekMeetingsList = monthMeetings
    ?.filter(meeting => {
      return meeting.meetingStart?.toDate() >= weekStart && meeting.meetingStart?.toDate() <= weekEnd
        && !meeting.isActive
    })
    .map((meeting, index) => {
      return <MeetingCard
        key={index}
        meeting={meeting}
      />
    })

  const monthMeetingsList = monthMeetings
    ?.filter(meeting => !meeting.isActive)
    .map((meeting, index) => {
      return <MeetingCard
        key={index}
        meeting={meeting}
      />
    })

  return (
    <div className="meetings-home-page">
      <div className="titles">
        <h3>Organization Meetings</h3>
        {
          canCreateMeeting &&
          <AppButton
            label="Create Meeting"
            rightIcon="fal fa-plus"
            url="/meetings/meeting/new"
          />
        }
      </div>
      <div className="toolbar">
        <div className="left side">
          <AppInput
            placeholder="Search meetings..."
          />
          <AppButton
            label="Filters"
            leftIcon="fas fa-filter"
            buttonType="invertedBtn"
          />
          <AppButton
            label="View"
            leftIcon="fas fa-th"
            buttonType="invertedBtn"
          />
        </div>
        <div className="right side">

        </div>
      </div>
      <div className="meetings-content">
        <div className="home-section">
          <h5>
            <i className="fas fa-circle" />
            Live Now
          </h5>
          <div className="meetings-flex">
            {liveMeetingsList}
          </div>
        </div>
        <div className="home-section">
          <h5>
            <i className="fas fa-calendar-day" />
            Today
          </h5>
          <div className="meetings-flex">
            {todayMeetingsList}
          </div>
        </div>
        <div className="home-section">
          <h5>
            <i className="fas fa-calendar-week" />
            This Week
          </h5>
          <div className="meetings-flex">
            {weekMeetingsList}
          </div>
        </div>
        <div className="home-section">
          <h5>
            <i className="fas fa-calendar-alt" />
            This Month
          </h5>
          <div className="meetings-flex">
            {monthMeetingsList}
          </div>
        </div>
      </div>
    </div>
  )
}
