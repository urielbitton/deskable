import { getDocsCount } from "app/services/CrudDB"
import { doGetUserByID, getUserByID } from "app/services/userServices"
import React, { useEffect, useState } from 'react'

export default function useUser(userID) {

  const [appUser, setAppUser] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserByID(userID, setAppUser)
    }
  },[userID])

  return appUser
}

export function useUsers(userIDs) {

  const [appUsers, setAppUsers] = useState(null)

  useEffect(() => {
    if(userIDs?.length) {
      const promises = userIDs.map(userID => doGetUserByID(userID))
      Promise.all(promises).then(users => {
        setAppUsers(users)
      })
    }
  },[userIDs])

  return appUsers
}

export const useDocsCount = (path, updateTrigger) => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    getDocsCount(path)
    .then(data => {
      setCount(data.data().count)
    })
  }, [path, updateTrigger])

  return count
}