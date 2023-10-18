import CreateMeeting from "app/components/meetings/CreateMeeting"
import MeetingsHome from "app/components/meetings/MeetingsHome"
import AppCard from "app/components/ui/AppCard"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { Route, Routes } from "react-router-dom"
import WaitingRoom from "app/components/meetings/WaitingRoom"

export default function MeetingsPage() {

  const { myMemberType } = useContext(StoreContext)
  const canCreateMeeting = myMemberType === 'classa' || myMemberType === 'classb'

  return (
    <AppCard 
      className="meetings-page"
      padding="0"
      withBorder
      styles={{ height: "100%", overflowX: 'hidden'  }}
    >
      <Routes>
        <Route index element={<MeetingsHome />} />
        { canCreateMeeting && <Route path="meeting/new" element={<CreateMeeting />} /> }
        <Route path="meeting-room/:meetingID" element={<WaitingRoom />} />
      </Routes>
    </AppCard>
  )
}
