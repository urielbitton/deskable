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
  const hasBadge = (badge?.length > 0 || badgeIcon)

  return (
    <div 
      className={`settings-section ${className} ${!hasAccess ? 'no-access' : ''} ${isActive ? 'active' : ''}`}
      key={label}
    >
      <div className="left-side">
        { 
          hasBadge && 
          <AppBadge 
            label={badge}
            icon={badgeIcon}
            fontSize={10}
            iconSize={10}
          /> 
        }
        <h5>{label}</h5>
        <h6>{sublabel}</h6>
      </div>
      <div className={`right-side ${flexStart ? 'flex-start' : ''} ${hasBadge ? 'has-badge' : ''}`}>
        {children}
      </div>
    </div>
  )
}
