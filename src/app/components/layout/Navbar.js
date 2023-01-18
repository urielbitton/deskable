import { functions } from "app/firebase/fire"
import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import DropdownButton from "../ui/DropdownButton"
import NavSearch from "./NavSearch"
import './styles/Navbar.css'

export default function Navbar() {

  const { compactNav, setShowMobileSidebar, myMemberType } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const isClassA = myMemberType === 'classa'

  return (
    <nav className={`navbar ${compactNav ? 'compact-nav' : ''}`}>
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
              isClassA && { label: "New Employee", icon: "fas fa-user-plus", url: "/employees/new"},
              { label: "New Project", icon: "fas fa-project-diagram", url: "/projects/new" },
              { label: "New Message", icon: "fas fa-comment", url: "/messages/new" },
              { label: "New Meeting", icon: "fas fa-video", url: "/meetings/new" },
              { label: "New Event", icon: "fas fa-calendar-alt", url: "/events/new" },
            ]}
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
