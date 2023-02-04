import React from 'react'
import { AppInput } from "./AppInputs"

export default function AppTagInput(props) {

  const { label, placeholder, value, onChange, users,
    showImgs } = props

  const usersRender = users?.map((user) => {
    return <div 
      key={user.userID}
      className="user-row"
    >
      {
        showImgs && <img src={user.photoURL} alt="user" />
      }
      <h6>{user.firstName} {user.lastName}</h6>
    </div>
  })

  return (
    <div className="app-tag-input">
      { label && <h6>{label}</h6> }
      <AppInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="tags-container">
        {usersRender}
      </div>
    </div>
  )
}
