import { useCalendarMonthEvents } from "app/hooks/eventHooks"
import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { dateChangeService } from "app/services/calendarServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useRef, useState } from 'react'
import EventItem from "../events/EventItem"
import AppButton from "../ui/AppButton"
import AppCalendar from "../ui/AppCalendar"
import AppTabsBar from "../ui/AppTabsBar"
import IconContainer from "../ui/IconContainer"
import NavDropdown from "./NavDropdown"
import NewEventModal from "./NewEventModal"
import NotificationElement from "./NotificationElement"
import ProfileDropdown from "./ProfileDropdown"
import './styles/RightBar.css'

export default function RightBar() {

  const { myUser, myUserID, myUserName } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const [tabsBarIndex, setTabsBarIndex] = useState(0)
  const [calendarRangeStartDate, setCalendarRangeStartDate] = useState(new Date())
  const [calendarRangeEndDate, setCalendarRangeEndDate] = useState(new Date())
  const [customCalendarViewTitle, setCustomCalendarViewTitle] = useState('')
  const calendarRef = useRef(null)
  const monthEvents = useCalendarMonthEvents(calendarRangeStartDate)
  const unreadNotifications = useUnreadNotifications(myUserID)
  const notifications = useAllNotifications(myUserID, 5)
  const calendarAPI = calendarRef?.current?.getApi()

  const notificationsList = notifications?.map((notif, index) => {
    return <NotificationElement
      key={index}
      notif={notif}
    />
  })

  const eventsList = monthEvents?.map((event, index) => {
    return <EventItem 
      key={index}
      event={event}
    />
  })

  const goToToday = () => {
    dateChangeService(
      'today', 
      calendarAPI, 
      setCustomCalendarViewTitle, 
      setCalendarRangeStartDate, 
      setCalendarRangeEndDate
    )
  }

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
              setShowMenu(showMenu === 'messages' ? null : 'messages')
            }}
            badgeBgColor="var(--lightGrayText)"
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
        </div>
        <h4>{myUserName}</h4>
        <h6>{myUser?.title}</h6>
      </div>
      <div className="content">
        <AppTabsBar>
          <h6
            className={`tab-item ${tabsBarIndex === 0 ? 'active' : ''}`}
            onClick={() => setTabsBarIndex(0)}
          >
            <i className="fas fa-calendar-alt" />
            Calendar
          </h6>
          <h6
            className={`tab-item ${tabsBarIndex === 1 ? 'active' : ''}`}
            onClick={() => setTabsBarIndex(1)}
          >
            <i className="fas fa-tasks" />
            Tasks
          </h6>
        </AppTabsBar>
        <div className={`tab-content calendar-content ${tabsBarIndex === 0 ? 'show' : ''}`}>
          <AppCalendar 
            events={monthEvents}
            viewMode="dayGridMonth"
            setViewMode={() => { }}
            calendarRef={calendarRef}
            initialView="dayGridMonth"
            setCalendarRangeStartDate={setCalendarRangeStartDate}
            setCalendarRangeEndDate={setCalendarRangeEndDate}
            customCalendarViewTitle={customCalendarViewTitle}
            setCustomCalendarViewTitle={setCustomCalendarViewTitle}
          />
          <AppButton
            label="Today"
            buttonType="tabBlueBtn"
            onClick={() => goToToday()}
          />
          <div className="events-list">
            {eventsList}
          </div>
        </div>
        <div className={`tab-content ${tabsBarIndex === 1 ? 'show' : ''}`}>

        </div>
      </div>
      <NewEventModal />
    </div>
  )
}
