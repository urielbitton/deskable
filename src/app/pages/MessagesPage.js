import React, { useState } from 'react'
import './styles/MessagesPage.css'
import ChatContainer from "app/components/chats/ChatContainer"
import NotifPermissionsBar from "app/components/ui/NotifPermissionsBar"
import { createPushNotif } from "app/services/notifServices"

export default function MessagesPage() {

  const shouldShowBar = !!!localStorage.getItem('notifPermission')
  const [showBar, setShowBar] = useState(shouldShowBar)

  const requestNotificationPermission = async (status) => {
    if(status === 'stop') {
      localStorage.setItem('notifPermission', 'ignored')
      setShowBar(false)
      return console.log('stopped')
    }
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        // Permission granted, you can now send notifications.
        //send feedback to ui that permission was granted
        localStorage.setItem('notifPermission', 'granted')
        setShowBar(false)
        createPushNotif(
          "Deskable Notifications Enabled", 
          "You will now receive notifications from your organization.",
        )
      }
      else {
        setShowBar(false)
        localStorage.setItem('notifPermission', 'denied')
        //send feedback to ui that permission was denied
      }
    } catch (error) {
      console.error('Notification permission request failed:', error)
    }
  }

  return (
    <div className="messages-page">
      <ChatContainer />
      <NotifPermissionsBar 
        showBar={showBar}
        text={<>
          <span onClick={() => requestNotificationPermission('enable')}>
            <i className="fas fa-bell-exclamation" />
            Enable notifications
          </span> to receive messages from your organization.
        </>}
        onStopped={() => requestNotificationPermission('stop')}
        onClose={() => setShowBar(false)}
      />
    </div>
  )
}
