import MeetingsHome from "app/components/meetings/MeetingsHome"
import AppCard from "app/components/ui/AppCard"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'

export default function MeetingsPage() {

  const { setHideRightBar } = useContext(StoreContext)

  useEffect(() => {
    setHideRightBar(true)
    return () => setHideRightBar(false)
  },[])

  return (
    <AppCard 
      className="meetings-page"
      padding="0"
      withBorder
    >
      <MeetingsHome />
    </AppCard>
  )
}
