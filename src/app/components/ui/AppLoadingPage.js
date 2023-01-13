import React from 'react'
import './styles/AppLoadingPage.css'
import logo from 'app/assets/images/logo2.png'
import DotsLoader from "./DotsLoader"

export default function AppLoadingPage() {
  return (
    <div className="app-loading-page">
      <div className="top"/>
      <div className="middle">
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>
        <DotsLoader loading />
      </div>
      <div className="bottom">
        <h5>Deskable</h5>
        <small>Boost your team's efficiency</small>
      </div>
    </div>
  )
}
