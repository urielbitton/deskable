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
import MyProfilePage from "app/pages/MyProfilePage"
import MyOrgPage from "app/pages/MyOrgPage"
import UserManagement from "app/pages/UserManagement"
import CreateOrgPage from "app/pages/CreateOrgPage"

export default function RoutesContainer() {

  const { myMemberType, myOrgID } = useContext(StoreContext)
  const isClassA = myMemberType === "classa"

  return (
    <div className={`routes-container`}>
      <Routes>
        <Route index element={<HomePage />} />
        {
          myOrgID &&
          <>
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/:postID" element={<PostPage />} />
            <Route path="posts/:postID/photos" element={<PostPhotosModalPage />} />
            <Route path="projects/*" element={<ProjectsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="my-organization" element={<MyOrgPage />} />
          </>
        }
        <Route path="create-organization" element={<CreateOrgPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="my-profile" element={<MyProfilePage />} />
        <Route path="login" element={<HomePage />} />
        <Route path="register" element={<HomePage />} />
        {
          isClassA && myOrgID &&
          <>
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/:employeeID" element={<EmployeePage />} />
          </>
        }
        <Route path="user-management/*" element={<UserManagement />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
