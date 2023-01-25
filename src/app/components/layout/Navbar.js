import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import DropdownButton from "../ui/DropdownButton"
import IconContainer from "../ui/IconContainer"
import NavDropdown from "./NavDropdown"
import NavSearch from "./NavSearch"
import NotificationElement from "./NotificationElement"
import './styles/Navbar.css'

export default function Navbar() {

  const { myUserID, setShowMobileSidebar, myMemberType } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const unreadNotifications = useUnreadNotifications(myUserID)
  const notifications = useAllNotifications(myUserID, 5)
  const isClassA = myMemberType === 'classa'

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
    <nav className="navbar">
      <div className="topbar">
        <div className="left">
          <NavSearch />
          <div
            className="mobile-btn"
            onClick={() => setShowMobileSidebar(true)}
          >
            <i className="fal fa-bars" />
          </div>
        </div>
        <div className="right">
          <DropdownButton
            label="Create New"
            iconRight="fal fa-plus"
            showMenu={showMenu === 'show'}
            setShowMenu={setShowMenu}
            className="create-new-btn"
            buttonType="outlineWhiteBtn"
            rightIcon="fal fa-chevron-down"
            items={[
              { label: "New Post", icon: "fas fa-newspaper", url: "/posts/new" },
              isClassA && { label: "New Employee", icon: "fas fa-user-plus", url: "/employees/new" },
              { label: "New Project", icon: "fas fa-project-diagram", url: "/projects/new" },
              { label: "New Message", icon: "fas fa-comment", url: "/messages/new" },
              { label: "New Meeting", icon: "fas fa-video", url: "/meetings/new" },
              { label: "New Event", icon: "fas fa-calendar-alt", url: "/events/new" },
            ]}
          />
          <IconContainer
            icon="fas fa-bell"
            inverted
            iconColor="#fff"
            iconSize="16px"
            dimensions="30px"
            tooltip="Notifications"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'notifications' ? null : 'notifications')
            }}
            badgeValue={unreadNotifications.length}
            badgeBgColor="#fff"
            badgeTextColor="var(--darkGrayText)"
          />
          <IconContainer
            icon="fas fa-comment"
            inverted
            iconColor="#fff"
            iconSize="16px"
            dimensions="30px"
            tooltip="Messages"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'messages' ? null : 'messages')
            }}
            badgeBgColor="#fff"
            badgeTextColor="var(--darkGrayText)"
          />
          <NavDropdown
            label="Notifications"
            viewAllURL="/notifications"
            menuName="notifications"
            showDropdown={showMenu}
            setShowDropdown={setShowMenu}
            itemsRender={notificationsList}
          />
          <div className="rightbar-btn">
            <i className="fal fa-bars" />
          </div>
        </div>
      </div>
      <div className="shapes-container">
        <div className="shape shape1" />
        <div className="shape shape2" />
        <div className="shape shape3" />
        <div className="shape shape4" />
      </div>
    </nav>
  )
}
