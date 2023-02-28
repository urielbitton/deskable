import { signOut } from "app/services/CrudDB"
import React from 'react'
import AppButton from "./AppButton"

export default function AccountError() {

  return (
    <>
      There is an error with your account.<br />
      <AppButton
        label="Sign Out"
        onClick={() => signOut()}
      />
    </>
  )
}
