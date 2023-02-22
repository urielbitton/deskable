import React from 'react'
import { AppInput } from "./AppInputs"
import './styles/DropdownSearch.css'

export default function DropdownSearch(props) {

  const { placeholder, value, onChange, onEnterPress,
    searchResults, dropdownTitle, showDropdown } = props

  return (
    <div className="dropdown-search-container">
      <AppInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyUp={(e) => (e.key === 'Enter' ? onEnterPress() : null)}
        iconright={<i className="fal fa-search" />}
      />
      {
        showDropdown &&
        <div className="dropdown-search-results">
          {dropdownTitle}
          {searchResults}
        </div>
      }
    </div>
  )
}
