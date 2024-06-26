import React, { useContext, useEffect } from 'react'
import './styles/Sidebar.css'
import logo from 'app/assets/images/logo.png'
import { menuLinks } from "app/data/menuLinks"
import { NavLink, useLocation } from "react-router-dom"
import { StoreContext } from "app/store/store"

export default function Sidebar() {

  const { myMemberType, showMobileSidebar, setShowMobileSidebar,
    myOrgID } = useContext(StoreContext)
  const location = useLocation()

  const navLinksList = menuLinks
  ?.filter(link => (link.require === 'any' || link.require === myMemberType) && (link.requiresOrg ? myOrgID !== null : true))
  .map((link, index) => {
    return <NavLink
      key={index}
      to={link.url}
    >
      <i className={link.icon}></i>
      <span>{link.name}</span>
    </NavLink>
  })

  useEffect(() => {
    if (showMobileSidebar) {
      setShowMobileSidebar(false)
    }
  }, [location])

  return (
    <>
      <div className={`sidebar ${showMobileSidebar ? 'show-mobile' : ''}`}>
        <div className="top">
          <div className="logo">
            <img
              src={logo}
              alt="logo"
            />
          </div>
          <div className="menu">
            {navLinksList}
          </div>
        </div>
        <div className="bottom">
          
        </div>
        <i
          className="fal fa-times close-sidebar"
          onClick={() => setShowMobileSidebar(false)}
        />
      </div>
      {
        showMobileSidebar &&
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setShowMobileSidebar(false)}
        />
      }
    </>
  )
}
