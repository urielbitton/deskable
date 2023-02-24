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
  const [windowIsFocused, setWindowIsFocused] = useState(false)
  const [pageLoading, setPageLoading] = useState(false) 
  const myUserID = user?.uid
  const myUserImg = myUser?.photoURL
  const myUserName = `${myUser?.firstName} ${myUser?.lastName}`
  const myMemberType = myUser?.memberType
  const myOrgID = myUser?.activeOrgID
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fimages%2FphotoURLPlaceholder.png?alt=media&token=e920fe83-3762-4093-ad42-abf85dfc8e2d'
  const projectAvatarImg = 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fimages%2Fproject-avatar-1.png?alt=media&token=58f72fba-49f4-491d-a1e4-207d5d8531dd'
  const percentFormat = new Intl.NumberFormat('en-CA', {style: 'percent'})
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [toasts, setToasts] = useState([])
  const [newEventModal, setNewEventModal] = useState({open: false, eventObject: null})
  const [hideRightBar, setHideRightBar] = useState(false)
  const [showProjectsSidebar, setShowProjectsSidebar] = useState(localStorage.getItem('showProjectsSidebar') === "true")

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

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if(document.visibilityState === 'visible') {
        setWindowIsFocused(true)
      }
      else {
        setWindowIsFocused(false)
      }
    })
  },[])

  return <StoreContext.Provider value={{ 
    user, myUser, setMyUser, myUserID, myUserImg, myUserName, myMemberType,
    myOrgID,
    pageLoading, setPageLoading,
    darkMode, setDarkMode,
    percentFormat,
    contentScrollBottom, setContentScrollBottom, 
    photoURLPlaceholder, projectAvatarImg,
    windowIsFocused,
    showMobileSidebar, setShowMobileSidebar,
    toasts, setToasts,
    newEventModal, setNewEventModal,
    hideRightBar, setHideRightBar, showProjectsSidebar, setShowProjectsSidebar
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider