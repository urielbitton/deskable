import { infoToast } from "app/data/toastsTemplates"
import { useCalendarMonthEvents, useTodayTasks } from "app/hooks/calendarHooks"
import { createTaskService, dateChangeService } from "app/services/calendarServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import EventItem from "../calendars/EventItem"
import TaskItem from "../calendars/TaskItem"
import AppButton from "../ui/AppButton"
import AppCalendar from "../ui/AppCalendar"
import { AppInput, AppSwitch } from "../ui/AppInputs"
import AppTabsBar from "../ui/AppTabsBar"
import NewEventModal from "./NewEventModal"
import ProfileDropdown from "./ProfileDropdown"
import './styles/RightBar.css'

export default function RightBar() {

  const { myUser, myUserID, myUserName, setToasts } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const [tabsBarIndex, setTabsBarIndex] = useState(0)
  const [calendarRangeStartDate, setCalendarRangeStartDate] = useState(new Date())
  const [calendarRangeEndDate, setCalendarRangeEndDate] = useState(new Date())
  const [customCalendarViewTitle, setCustomCalendarViewTitle] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAllTasks, setShowAllTasks] = useState(true)
  const calendarRef = useRef(null)
  const monthEvents = useCalendarMonthEvents(calendarRangeStartDate)
  const todayTasks = useTodayTasks()
  const calendarAPI = calendarRef?.current?.getApi()
  const todayDateText = convertClassicDate(new Date())

  const eventsList = monthEvents?.map((event, index) => {
    return <EventItem
      key={index}
      event={event}
    />
  })

  const tasksList = todayTasks
    ?.filter(task => !showAllTasks ? !task.isDone : true)
    ?.sort((a, b) => a.isDone - b.isDone)
    .map((task, index) => {
      return <TaskItem
        key={index}
        task={task}
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

  const addNewTask = (e) => {
    if (e.key === 'Enter') {
      if (!taskTitle) return setToasts(infoToast('Please enter a task title.'))
      createTaskService(
        myUserID,
        taskTitle,
        setToasts,
        setLoading
      )
        .then(() => setTaskTitle(''))
    }
  }

  return (
    <div className="rightbar">
      <div className="header">
        <div className="row">
          <ProfileDropdown
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            avatarDimensions="67px"
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
        <div className={`tab-content ${tabsBarIndex === 0 ? 'show' : ''}`}>
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
          <div className="tasks-title-row">
            <h4>{todayDateText}</h4>
            <Link to="/tasks">See All</Link>
          </div>
          <div className="tools">
            <AppSwitch
              label="Not Done"
              checked={showAllTasks}
              onChange={(e) => setShowAllTasks(e.target.checked)}
              size="small"
            />
          </div>
          <AppInput
            type="text"
            placeholder="Add a task"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => addNewTask(e)}
            iconleft={!loading ? <i className="fas fa-tasks" /> : <i className="fas fa-spinner fa-spin" />}
            className="add-task-input"
          />
          <div className="tasks-list">
            {tasksList}
          </div>
        </div>
      </div>
      <NewEventModal />
    </div>
  )
}
