import AppButton from "app/components/ui/AppButton"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'

export default function HomePage() {

  const { myOrgID } = useContext(StoreContext)

  return myOrgID ? (
    <div>
      Homepage
    </div>
  ) :
  (
    <div className="create-org-popup">
      <h5>Create an organization to get started or ask to join one below</h5>
      <AppButton
        label="Create organization"
        url="/create-organization"
      />
      <br/>
      <br/>
      <input
        placeholder="Organization invite code"
      />
    </div>
  )
}
