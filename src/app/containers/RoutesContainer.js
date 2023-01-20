import React, { useContext, useEffect, useRef } from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { StoreContext } from "app/store/store"
import { Routes, Route } from "react-router"
import ProjectsPage from "app/pages/ProjectsPage"
import EmployeesPage from "app/pages/EmployeesPage"
import PostsPage from "app/pages/PostsPage"
import MessagesPage from "app/pages/MessagesPage"
import MeetingsPage from "app/pages/MeetingsPage"
import EventsPage from "app/pages/EventsPage"
import ResourcesPage from "app/pages/ResourcesPage"
import SettingsPage from "app/pages/SettingsPage"
import CalendarPage from "app/pages/CalendarPage"
import EmployeePage from "app/pages/EmployeePage"

export default function RoutesContainer() {

  const { compactNav } = useContext(StoreContext)
  const windowRef = useRef(null)

  return (
    <div className={`routes-container ${compactNav ? 'compact' : ''}`} ref={windowRef}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employee/:employeeID" element={<EmployeePage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="login" element={<HomePage />} />
        <Route path="register" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
