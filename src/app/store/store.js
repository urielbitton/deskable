import React, { createContext, useEffect, useState } from 'react'
import { auth } from 'app/firebase/fire'
import { getUserByID } from "app/services/userServices"

// @ts-ignore
export const StoreContext = createContext()

const StoreContextProvider = ({children}) => {
 
  const user = auth.currentUser
  const [myUser, setMyUser] = useState(null) 
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === "true")
  const [contentScrollBottom, setContentScrollBottom] = useState(false)
  const [pageLoading, setPageLoading] = useState(false) 
  const myUserID = user?.uid
  const myUserImg = myUser?.photoURL
  const myUserName = `${myUser?.firstName} ${myUser?.lastName}`
  const myMemberType = myUser?.memberType
  const myOrgID = myUser?.activeOrgID
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fimages%2FphotoURLPlaceholder.png?alt=media&token=e920fe83-3762-4093-ad42-abf85dfc8e2d'
  const percentFormat = new Intl.NumberFormat('en-CA', {style: 'percent'})
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [toasts, setToasts] = useState([])
  const [newEventModal, setNewEventModal] = useState({open: false, eventObject: null})
  const [hideRightBar, setHideRightBar] = useState(false)
  const [showProjectsSidebar, setShowProjectsSidebar] = useState(localStorage.getItem('showProjectsSidebar') === "true")
  const tinymceAPIKey = process.env.REACT_APP_TINYMCEKEY
  const groupChatDefaultImg = 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fimages%2Fgroup-chat-img.png?alt=media&token=6afc3906-3f1b-4323-b685-7e99f7e28e80&_gl=1*12ymc5t*_ga*MjUyMTY1MTA2LjE2NjQzNzM3MDA.*_ga_CW55HF8NVT*MTY5NzMzNzYyMS4xMjEuMS4xNjk3MzQwMDM1LjE3LjAuMA..'

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        getUserByID(user.uid, setMyUser)
      }
      else {
        setMyUser({})
      }
    })
  },[user])

  useEffect(() => {
    localStorage.setItem('darkmode', !darkMode ? "false" : "true")  
  },[darkMode]) 

  return <StoreContext.Provider value={{ 
    user, myUser, setMyUser, myUserID, myUserImg, myUserName, myMemberType,
    myOrgID,
    pageLoading, setPageLoading,
    darkMode, setDarkMode,
    percentFormat,
    contentScrollBottom, setContentScrollBottom, 
    photoURLPlaceholder, groupChatDefaultImg,
    showMobileSidebar, setShowMobileSidebar,
    toasts, setToasts,
    newEventModal, setNewEventModal,
    hideRightBar, setHideRightBar, showProjectsSidebar, setShowProjectsSidebar,
    tinymceAPIKey
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider