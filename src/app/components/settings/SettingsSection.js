import React from 'react'
import { useSearchParams } from "react-router-dom"
import AppBadge from "../ui/AppBadge"
import './styles/SettingsSection.css'

export default function SettingsSection(props) {

  const { label, sublabel='', badge='', flexStart=false, 
    children, className='', hasAccess=true, badgeIcon } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const goTo = searchParams.get('goTo')
  const isActive = goTo === className

  return (
    <div className={`settings-section ${className} ${!hasAccess ? 'no-access' : ''} ${isActive ? 'active' : ''}`}>
      <div className="left-side">
        { 
          (badge?.length > 0 || badgeIcon) && 
          <AppBadge 
            label={badge}
            icon={badgeIcon}
          /> 
        }
        <h5>{label}</h5>
        <h6>{sublabel}</h6>
      </div>
      <div className={`right-side ${flexStart ? 'flex-start' : ''}`}>
        {children}
      </div>
    </div>
  )
}
