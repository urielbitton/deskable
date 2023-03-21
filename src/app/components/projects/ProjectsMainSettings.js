import { useOrganization } from "app/hooks/organizationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import SettingsSection from "../settings/SettingsSection"
import { AppSwitch } from "../ui/AppInputs"
import './styles/ProjectsMainSettings.css'

export default function ProjectsMainSettings() {

  const { myUserID, myOrgID } = useContext(StoreContext)
  const [lastColumnCompleted, setLastColumnCompleted] = useState(true)
  const [showBoardFilters, setShowBoardFilters] = useState(true)
  const [askSprintDone, setAskSprintDone] = useState(true)
  const org = useOrganization(myOrgID)
  const canModifySetting = myUserID === org?.ownerID

  return (
    <div className="projects-main-settings">
      <h3>Settings</h3>
      <div className="settings-container">
        <h5>Board</h5>
        <SettingsSection
          label="Last board column"
          sublabel="Tasks in the last column will be marked as completed and archived when sprint ends."
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppSwitch
            checked={lastColumnCompleted}
            onChange={(e) => setLastColumnCompleted(e.target.checked)}
            disabled={!canModifySetting}
          />
        </SettingsSection>
        <SettingsSection
          label="Show filters"
          sublabel="Show task filters on the project board page"
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppSwitch
            checked={showBoardFilters}
            onChange={(e) => setShowBoardFilters(e.target.checked)}
            disabled={!canModifySetting}
          />
        </SettingsSection>
      </div>
      <div className="settings-container">
        <h5>Sprint</h5>
        <SettingsSection
          label="Move remaining tasks"
          sublabel={askSprintDone ? "Ask me where to move remaining tasks when sprint is complete." : 'Move remaining tasks to the next sprint when sprint is complete.'}
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <AppSwitch
            checked={askSprintDone}
            onChange={(e) => setAskSprintDone(e.target.checked)}
            disabled={!canModifySetting}
          />
        </SettingsSection>
      </div>
      <div className="settings-container">
        <h5>Tasks</h5>
        <SettingsSection
          label="Task Types"
          sublabel="Task types are used to categorize tasks and filter them on the board. You can add, edit, and delete task types."
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <h6>Coming soon...</h6>
        </SettingsSection>
      </div>
      <div className="settings-container">
        <h5>Notifications</h5>
        <SettingsSection
          label="Move remaining tasks"
          sublabel={askSprintDone ? "Ask me where to move remaining tasks when sprint is complete." : 'Move remaining tasks to the next sprint when sprint is complete.'}
          hasAccess={canModifySetting}
          badge="Admins"
          badgeIcon="fas fa-lock"
        >
          <h6>Coming soon...</h6>
        </SettingsSection>
      </div>
    </div>
  )
}
