import React, { useContext } from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
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
import { StoreContext } from "app/store/store"
import NewEmployeePage from "app/pages/NewEmployeePage"
import TasksPage from "app/pages/TasksPage"
import PostPhotosModalPage from "app/pages/PostPhotosModalPage"
import PostPage from "app/pages/PostPage"

export default function RoutesContainer() {

  const { myMemberType } = useContext(StoreContext)
  const isClassA = myMemberType === "classa"

  return (
    <div className={`routes-container`}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/:postID" element={<PostPage />} />
        <Route path="posts/:postID/photos" element={<PostPhotosModalPage />} />
        <Route path="projects/*" element={<ProjectsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="login" element={<HomePage />} />
        <Route path="register" element={<HomePage />} />
        {
          isClassA &&
          <>
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/new" element={<NewEmployeePage />} />
          <Route path="employees/:employeeID" element={<EmployeePage />} />
          </>
        }
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
