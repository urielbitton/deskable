import { switchTaskType } from "app/data/projectsData"
import { truncateText } from "app/utils/generalUtils"
import React from 'react'
import { useNavigate } from "react-router-dom"
import PageIcon from "../ui/PageIcon"
import './styles/ProjectSearchItem.css'

export default function ProjectSearchItem(props) {

  const { setShowSearchDropdown, itemID, isTaskType,
    projectID, title, taskType, taskNum } = props
  const navigate = useNavigate()
  const navigateLink = isTaskType ? `/projects/${projectID}/backlog?taskID=${itemID}` : `/projects/${projectID}/pages/${itemID}`

  return (
    <div
      className="project-search-item"
      onClick={() => {
        navigate(navigateLink)
        setShowSearchDropdown(false)
      }}
      key={itemID}
    >
      <div className="left">
        {
          isTaskType ?
            <span
              className="icon"
              style={{ background: switchTaskType(taskType).color }}
            >
              <i className={switchTaskType(taskType).icon} />
            </span>
            :
            <PageIcon />
        }
        <h6>{truncateText(title, 37)}</h6>
      </div>
      <div className="right">
        {isTaskType && <small>{taskNum}</small>}
      </div>
    </div>
  )
}
