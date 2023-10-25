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
import { deleteMeetingService } from "app/services/meetingsServices"
import { sendSgEmail } from "app/services/emailServices"
import { newEventEmailTemplate } from "app/data/emailTemplates"

export default function MeetingsHome() {

  const { myMemberType, orgAdmin, myOrgID,
    setToasts, setPageLoading } = useContext(StoreContext)
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
  const oldMeetings = useRangedMeetings(new Date('01-01-2000'), monthStart, meetingLimits)
  const canCreateMeeting = myMemberType === 'classa'

  const handleDeleteMeeting = (e, meeting) => {
    e.preventDefault()
    if(!canCreateMeeting) return alert("You don't have permission to delete meetings.")
    const confirm = window.confirm(`Are you sure you want to delete the meeting ${meeting.title}?`)
    if (!confirm) return
    setPageLoading(true)
    return deleteMeetingService({
      meetingID: meeting.meetingID,
      orgID: myOrgID,
      setToasts,
      setPageLoading
    })
  }

  const meetingTimesNotLive = meeting => {
    return !(new Date() >= meeting.meetingStart?.toDate() && new Date() <= meeting.meetingEnd?.toDate())
  }

  const todayMeetingsFilter = monthMeetings?.filter(meeting => {
    return meeting.meetingStart?.toDate() >= todayStart && meeting.meetingStart?.toDate() <= todayEnd
      && meetingTimesNotLive(meeting)
  })

  const weekMeetingsFilter = monthMeetings
    ?.filter(meeting => {
      return meeting.meetingStart?.toDate() >= weekStart && meeting.meetingStart?.toDate() <= weekEnd
        && meetingTimesNotLive(meeting)
    })

  const monthMeetingsFilter = monthMeetings?.filter(meeting => meetingTimesNotLive(meeting))

  const liveMeetingsList = liveMeetings?.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
    />
  })

  const todayMeetingsList = todayMeetingsFilter.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
    />
  })

  const weekMeetingsList = weekMeetingsFilter.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
    />
  })

  const monthMeetingsList = monthMeetingsFilter.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
    />
  })

  const oldMeetingsList = oldMeetings?.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
      deleteAction={
        <div 
          className="close"
          title="Delete Meeting"
          onClick={(e) => handleDeleteMeeting(e, meeting)}
        >
          <i className="fal fa-times" />
        </div>
      }
    />
  })

  const test = () => {
    return sendSgEmail(
      'urielas@hotmail.com',
      'Test Email',
      newEventEmailTemplate({
        name:'Uriel Bitton', title:'title', guests:[{name: 'Uriel Bitton', email: 'urielas@hotmail.com'}], dates: {startingDate: new Date(), endingDate: new Date()}, description:'description', meetingID:'meetingID', roomID:'roomID'
      })
    )
  }

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
            <i className="fas fa-headset" />
            Live Now
          </h5>
          <div className="meetings-flex">
            {
              liveMeetings.length > 0 ? liveMeetingsList :
                <small className="no-meetings">There are no live meetings</small>
            }
          </div>
        </div>
        <div className="home-section">
          <h5 onClick={test}>
            <i className="fas fa-calendar-day" />
            Today
          </h5>
          <div className="meetings-flex">
            {
              todayMeetingsFilter.length > 0 ? todayMeetingsList :
                <small className="no-meetings">There are no meetings today</small>
            }
          </div>
        </div>
        <div className="home-section">
          <h5>
            <i className="fas fa-calendar-week" />
            This Week
          </h5>
          <div className="meetings-flex">
            {
              weekMeetingsFilter.length > 0 ? weekMeetingsList :
                <small className="no-meetings">There are no meetings this week</small>
            }
          </div>
        </div>
        <div className="home-section">
          <h5>
            <i className="fas fa-calendar-alt" />
            This Month
          </h5>
          <div className="meetings-flex">
            {
              monthMeetingsFilter.length > 0 ? monthMeetingsList :
                <small className="no-meetings">There are no meetings this month</small>
            }
          </div>
        </div>
        {
          orgAdmin &&
          <div className="home-section">
            <h5>
              <i className="fas fa-history" />
              Past Meetings
            </h5>
            <div className="meetings-list">
              {oldMeetingsList}
            </div>
          </div>
        }
      </div>
    </div>
  )
}
