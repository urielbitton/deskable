import AppButton from "app/components/ui/AppButton"
import { createNotification } from "app/services/notifServices"
import { handleJoinOrgService } from "app/services/organizationServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'

export default function HomePage() {

  const { myOrgID, myUserID } = useContext(StoreContext)
  const [joinCode, setJoinCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoinOrg = () => {
    setLoading(true)
    handleJoinOrgService(joinCode, myUserID)
    .then(() => {
      setLoading(false)
      createNotification(
        myUserID,
        'Organization Joined',
        `You have successfully joined the organization. You can view active projects here.`,
        'fas fa-users',
        `/projects`
      )
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
  }

  return myOrgID ? (
    <div>
      Homepage
    </div>
  ) :
  (
    <div className="create-org-popup">
      <h5>Create an organization to get started or ask to join one below</h5>
      <br/>
      <AppButton
        label="Create organization"
        url="/create-organization"
      />
      <br/>
      <br/>
      <h5>Or join your organization by entering the join code below</h5>
      <br/>
      <input
        placeholder="Organization invite code"
        value={joinCode}
        onChange={e => setJoinCode(e.target.value)}
      />
      <br/>
      <br/>
      <AppButton
        label="Join Organization"
        onClick={handleJoinOrg}
        loading={loading}
        disabled={loading || !joinCode}
      />
    </div>
  )
}
