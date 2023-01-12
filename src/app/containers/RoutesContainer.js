import React, { useContext, useEffect, useRef } from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { StoreContext } from "app/store/store"
import { Routes, Route, useLocation } from "react-router"

export default function RoutesContainer() {

  const { compactNav } = useContext(StoreContext)
  const windowRef = useRef(null)
  const location = useLocation()

  return (
    <div className={`routes-container ${compactNav ? 'compact' : ''}`} ref={windowRef}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="login" element={<HomePage />} />
        <Route path="register" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
