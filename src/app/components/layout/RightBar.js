import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import IconContainer from "../ui/IconContainer"
import NavDropdown from "./NavDropdown"
import NotificationElement from "./NotificationElement"
import ProfileDropdown from "./ProfileDropdown"
import './styles/RightBar.css'

export default function RightBar() {

  const { myUser, myUserID, myUserName } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const unreadNotifications = useUnreadNotifications(myUserID)
  const notifications = useAllNotifications(myUserID, 5)

  const notificationsList = notifications?.map((notif, index) => {
    return <NotificationElement
      key={index}
      notif={notif}
    />
  })

  useEffect(() => {
    if (showMenu !== null) {
      window.onclick = () => setShowMenu(null)
    }
    return () => window.onclick = null
  }, [showMenu])

  return (
    <div className="rightbar">
      <div className="header">
        <div className="row">
          <IconContainer
            icon="fas fa-bell"
            inverted
            iconColor="var(--lightGrayText)"
            iconSize="18px"
            dimensions="32px"
            tooltip="Notifications"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'notifications' ? null : 'notifications')
            }}
            badgeValue={unreadNotifications.length}
            badgeBgColor="var(--lightGrayText)"
            badgeTextColor="var(--darkGrayText)"
          />
          <ProfileDropdown
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            avatarDimensions="67px"
          />
          <IconContainer
            icon="fas fa-comment"
            inverted
            iconColor="var(--lightGrayText)"
            iconSize="18px"
            dimensions="32px"
            tooltip="Messages"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'notifications' ? null : 'notifications')
            }}
            badgeBgColor="var(--lightGrayText)"
            badgeTextColor="var(--darkGrayText)"
          />
          <NavDropdown
            label="Notifications"
            viewAllURL="/notifications"
            type="notifications"
            showDropdown={showMenu}
            setShowDropdown={setShowMenu}
            itemsRender={notificationsList}
          />
        </div>
        <h4>{myUserName}</h4>
        <h6>{myUser?.title}</h6>
      </div>
      <div className="content">

      </div>
    </div>
  )
}
