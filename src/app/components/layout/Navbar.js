import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import DropdownButton from "../ui/DropdownButton"
import IconContainer from "../ui/IconContainer"
import NavDropdown from "./NavDropdown"
import NavSearch from "./NavSearch"
import NotificationElement from "./NotificationElement"
import ProfileDropdown from "./ProfileDropdown"
import './styles/Navbar.css'

export default function Navbar() {

  const { myUserID, setShowMobileSidebar, myMemberType,
    hideRightBar, setHideRightBar, myOrgID } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const unreadNotifications = useUnreadNotifications(myUserID, 50)
  const notifications = useAllNotifications(myUserID, 5)
  const canCreateProject = myMemberType === 'classa' || myMemberType === 'classb'
  const canCreateMeeting = myMemberType === 'classa' || myMemberType === 'classb'
  const canCreateEvent = myMemberType === 'classa'
  const todaysDate = convertClassicDate(new Date())

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
          <h4>Deskable</h4>
          <NavSearch />
          <h5>
            <i className="fas fa-calendar-alt" />
            {todaysDate}
          </h5>
        </div>
        <div className="right">
          {
            myOrgID ?
              <DropdownButton
                label="Create New"
                iconRight="fal fa-plus"
                showMenu={showMenu === 'show'}
                setShowMenu={setShowMenu}
                className="create-new-btn"
                buttonType="outlineWhiteBtn"
                rightIcon="fal fa-chevron-down"
                items={[
                  { label: "New Post", icon: "fas fa-newspaper", url: "/posts" },
                  ...canCreateProject ? [{ label: "New Project", icon: "fas fa-project-diagram", url: "/projects/new" }] : [],
                  ...canCreateMeeting ? [{ label: "New Meeting", icon: "fas fa-video", url: "/meetings/meeting/new" }] : [],
                  { label: "New Message", icon: "fas fa-comment", url: "/messages/new-conversation" },
                  ...canCreateEvent ? [{ label: "New Event", icon: "fas fa-calendar-alt", url: "/events/new" }] : [],
                ]}
              /> :
              <AppButton
                label="Join Organization"
                buttonType="outlineWhiteBtn small"
                style={{ borderColor: 'rgba(255,255,255,0.4)' }}
              />
          }
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
          <NavDropdown
            label="Notifications"
            viewAllURL="/notifications"
            menuName="notifications"
            showDropdown={showMenu}
            setShowDropdown={setShowMenu}
            itemsRender={notificationsList}
          />
          <ProfileDropdown
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            avatarDimensions="27px"
          />
          <div className="rightbar-btn">
            <i className="fal fa-bars" />
          </div>
          {
            hideRightBar &&
            <IconContainer
              icon="fas fa-grip-lines-vertical"
              inverted
              iconColor="#fff"
              iconSize="16px"
              dimensions="30px"
              tooltip="Show Calendar Bar"
              onClick={() => {
                setHideRightBar(false)
                localStorage.setItem('hideRightBar', "false")
              }}
            />
          }
          <div
            className="mobile-btn"
            onClick={() => setShowMobileSidebar(true)}
          >
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
