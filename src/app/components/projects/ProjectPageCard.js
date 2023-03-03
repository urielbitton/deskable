import { convertAlgoliaDate, convertClassicDate } from "app/utils/dateUtils"
import { truncateText } from "app/utils/generalUtils"
import React from 'react'
import { Link } from "react-router-dom"
import DropdownIcon from "../ui/DropDownIcon"
import MultipleUsersAvatars from "../ui/MultipleUsersAvatars"
import PageIcon from "../ui/PageIcon"
import './styles/ProjectPageCard.css'

export default function ProjectPageCard(props) {

  const { title, pageID, dateCreated, type, projectID,
    editorsIDs } = props.page
  const { showCardMenu, setShowCardMenu } = props

  return (
    <Link
      to={`/projects/${projectID}/pages/${pageID}`}
      className="project-page-card"
      key={pageID}
    >
      <div className="header">
        <div className="texts">
          <PageIcon
            dimensions={24}
            gap={2.7}
          />
          <h5>{truncateText(title, 45)}</h5>
        </div>
        <div className="right">
          <DropdownIcon
            icon="far fa-ellipsis-h"
            iconSize={17}
            dimensions={24}
            iconColor="var(--grayText)"
            showMenu={showCardMenu === pageID}
            setShowMenu={setShowCardMenu}
            onClick={(e) => {
              e.preventDefault()
              setShowCardMenu(prev => prev === pageID ? null : pageID)
            }}
            items={[
              { label: 'Move to Trash', icon: 'fas fa-trash-alt', onClick: () => console.log('Move to Trash') },
              { label: 'Duplicate', icon: 'fas fa-copy', onClick: () => console.log('Duplicate') },
            ]}
          />
        </div>
      </div>
      <div className="card-body">
        <div className="editors-row">
          <h6>Editors</h6>
          <MultipleUsersAvatars
            userIDs={editorsIDs}
            maxAvatars={4}
            avatarDimensions={25}
          />
        </div>
        <h6>
          Type:
          <span className="cap">{type}</span>
        </h6>
        <h6>
          Created:
          <span>{convertClassicDate(convertAlgoliaDate(dateCreated))}</span>
        </h6>
      </div>
    </Link>
  )
}
