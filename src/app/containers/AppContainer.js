import React, { useContext } from 'react'
import './styles/AppContainer.css'
import './styles/DarkMode.css'
import { StoreContext } from "app/store/store"
import PageLoader from "app/components/ui/PageLoader"
import RoutesContainer from "./RoutesContainer"
import Sidebar from "app/components/layout/Sidebar"
import Navbar from "app/components/layout/Navbar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PreventTabClose from "app/components/ui/PreventTabClose"
import RightBar from "app/components/layout/RightBar"
import { useIsFullScreen } from "app/hooks/generalHooks"
import { useLocation } from "react-router-dom"

export default function AppContainer() {

  const { darkMode, pageLoading, hideRightBar } = useContext(StoreContext)
  const isFullscreen = useIsFullScreen()
  const location = useLocation()
  const isMeetingPage = location.pathname.includes('meeting-room')

  return (
    <div className={`app-container ${ darkMode ? "dark-app" : "" } ${hideRightBar ? 'hide-rightbar' : ''} `+ 
      `${(isFullscreen && isMeetingPage) ? 'meeting-fullscreen' : ''}`}
    >
      <HelmetTitle />
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <RoutesContainer />
      </div>
      { !hideRightBar && <RightBar /> }
      <PageLoader loading={pageLoading} />
      <PreventTabClose preventClose={pageLoading} />
    </div>
  )
}
