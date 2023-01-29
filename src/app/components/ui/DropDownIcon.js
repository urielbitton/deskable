import React, { useEffect } from 'react'
import './styles/DropdownButton.css'
import { Link } from "react-router-dom"
import IconContainer from "./IconContainer"

export default function DropdownIcon(props) {

  const { items, showMenu, setShowMenu, icon="far fa-ellipsis-v",
    iconColor, iconSize="19px", dimensions=32, tooltip, bgColor,
    dropdownPosition = "place-right-bottom", onClick } = props

  const itemsList = items
    ?.filter(item => item && !item.private)
    .map((item, index) => {
      return (
        !item.url ?
          <div
            key={index}
            onClick={() => item.onClick()}
            className="dropdown-item"
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </div> :
          <Link
            key={index}
            to={item.url}
            className="dropdown-item"
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
      )
    })

  useEffect(() => {
    if (showMenu !== null) {
      window.onclick = () => setShowMenu(null)
    }
    return () => window.onclick = null
  }, [showMenu])

  return (
    <div
      className="dropdown-button dropdown-icon"
      onClick={(e) => onClick(e)}
    >
      <IconContainer
        icon={icon}
        iconColor={iconColor}
        iconSize={iconSize}
        bgColor={bgColor}
        dimensions={dimensions}
        tooltip={tooltip}
      />
      <div className={`dropdown-menu ${showMenu ? 'show' : ''} ${dropdownPosition}`}>
        {itemsList}
      </div>
    </div>
  )
}
