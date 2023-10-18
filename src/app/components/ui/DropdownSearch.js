import React, { useEffect } from 'react'
import { AppInput } from "./AppInputs"
import './styles/DropdownSearch.css'

export default function DropdownSearch(props) {

  const { placeholder, value, onChange, onEnterPress,
    searchResults, dropdownTitle, onFocus, onBlur, 
    searchLoading, clearSearch, showSearchDropdown, 
    setShowSearchDropdown, inputRef } = props

  useEffect(() => {
    if (showSearchDropdown) {
      window.onclick = () => setShowSearchDropdown(false)
    }
  },[showSearchDropdown])

  useEffect(() => {
    if(value.length === 0) 
      setShowSearchDropdown(false)
  },[value])

  return (
    <div 
      className="dropdown-search-container"
      onClick={(e) => e.stopPropagation()}
    >
      <AppInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyUp={(e) => (e.key === 'Enter' ? onEnterPress() : null)}
        onFocus={onFocus}
        onBlur={onBlur}
        iconright={
          <i 
            className={!searchLoading ? value.length > 0 ? "fal fa-times" : "fal fa-search" : "fal fa-spinner-third fa-spin"} 
            onClick={() => value.length > 0 && clearSearch()}
          />
        }
        inputRef={inputRef}
      />
      {
        showSearchDropdown &&
        <div className="dropdown-search-results">
          {dropdownTitle}
          {searchResults}
        </div>
      }
    </div>
  )
}
