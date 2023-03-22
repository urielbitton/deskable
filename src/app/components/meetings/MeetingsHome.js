import React, { useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import './styles/MeetingsHome.css'
import { useLiveMeetings } from 'app/hooks/meetingsHooks'
import MeetingCard from "./MeetingCard"

export default function MeetingsHome() {

  const limitsNum = 10 
  const [meetingLimits, setMeetingLimits] = useState(limitsNum)
  const liveMeetings = useLiveMeetings(meetingLimits)

  const liveMeetingsList = liveMeetings?.map((meeting, index) => {
    return <MeetingCard
      key={index}
      meeting={meeting}
    />
  })

  return (
    <div className="meetings-home-page">
      <div className="titles">
        <h3>Organization Meetings</h3>
        <AppButton
          label="Create Meeting"
          rightIcon="fal fa-plus"
        />
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
      <div className="home-section">
        <h5><i className="fas fa-circle" />Live Now</h5>
        <div className="meetings-flex">
          {liveMeetingsList}
        </div>
      </div>
      <div className="home-section">
        <h5>Today</h5>
        <div className="meetings-flex">

        </div>
      </div>
      <div className="home-section">
        <h5>This Week</h5>
        <div className="meetings-flex">

        </div>
      </div>
      <div className="home-section">
        <h5>This Month</h5>
        <div className="meetings-flex">

        </div>
      </div>
    </div>
  )
}
