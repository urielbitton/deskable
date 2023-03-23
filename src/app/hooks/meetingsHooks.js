import { getLiveMeetingsByOrgID, getMeetingByID, getRangedMeetingsByOrgID } from "app/services/meetingsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useLiveMeetings = (limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    if (myOrgID) {
      getLiveMeetingsByOrgID(myOrgID, setMeetings, limit)
    }
  }, [myOrgID, limit])

  return meetings
}

export const useRangedMeetings = (start, end, limit) => {

  const { myOrgID } = useContext(StoreContext)
  const [meetings, setMeetings] = useState([])
  
  useEffect(() => {
    if (myOrgID) {
      getRangedMeetingsByOrgID(myOrgID, start, end, setMeetings, limit)
    }
  }, [myOrgID, start, end, limit])

  return meetings
}

export const useMeeting = (meetingID) => {
  
    const { myOrgID } = useContext(StoreContext)
    const [meeting, setMeeting] = useState(null)
  
    useEffect(() => {
      if (myOrgID) {
        getMeetingByID(myOrgID, meetingID, setMeeting)
      }
    }, [myOrgID, meetingID])
  
    return meeting
  }