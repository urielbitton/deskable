// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import './styles/AppInputs.css'
import Select from 'react-select'

export function AppInput(props) {

  const { label, className, iconleft, iconright, title = '' } = props

  return (
    <label
      className={`appInput commonInput ${className ?? ""}`}
      title={title ?? ""}
    >
      {label && <h6>{label}</h6>}
      <input {...props} />
      {iconright}
      {iconleft}
    </label>
  )
}

export function AppSelect(props) {

  const { options, label, onChange, onClick, value, className,
    button, containerStyles, styles } = props

  const optionsdata = options?.map((data, i) =>
    <option
      key={i}
      selected={data.selected}
      disabled={data.disabled}
      value={data.value}
    >
      {data.name || data.label}
    </option>
  )
  return (
    <label
      className={`appSelect commonInput ${className ?? ""}`}
      onClick={(e) => onClick && onClick(e)}
      style={containerStyles}
    >
      <h6>{label}</h6>
      <select
        onChange={(e) => onChange(e)}
        value={value}
        styles={styles}
      >
        {optionsdata}
      </select>
      {button}
    </label>
  )
}

export function AppTextarea(props) {

  const { label, iconclass, className } = props

  return (
    <label className={`appTextarea commonInput ${className ?? ""}`}>
      <h6>{label}</h6>
      <textarea
        style={{ paddingRight: iconclass ? "40px" : "10px" }}
        {...props}
      />
    </label>
  )
}

export function AppSwitch(props) {

  const { iconclass, label, onChange, checked, className, size = '' } = props

  return (
    <div className={`appSwitch commonInput ${className ?? ""} ${size}`}>
      <h6>
        <i className={iconclass}></i>
        {label}
      </h6>
      <label className="form-switch">
        <input
          type="checkbox"
          onChange={(e) => onChange(e)}
          checked={checked}
        />
        <i></i>
      </label>
    </div>
  )
}

export const AppCoverInput = (props) => {

  const { label, value, onChange, className, iconleft, iconright,
    title, type, showInput, setShowInput, cover, max, min,
    name, onCheck, onCancel, loading } = props
  const inputRef = useRef(null)

  const handleCheck = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onCheck && onCheck(e)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onCancel && onCancel(e)
  }

  useEffect(() => {
    if (showInput === name) {
      inputRef.current.focus()
      window.onclick = () => setShowInput(null)
    }
    return () => window.onclick = null
  }, [showInput])

  return (
    <label
      className={`appCoverInput commonInput ${className ?? ""}`}
      title={title ?? ""}
    >
      {label && <h6>{label}</h6>}
      <input
        onChange={(e) => onChange(e)}
        value={value}
        onClick={(e) => e.stopPropagation()}
        type={type}
        max={max}
        min={min}
        ref={inputRef}
        style={{ display: showInput === name ? "block" : "none" }}
      />
      {iconright}
      {iconleft}
      <div
        className="coverInput"
        style={{ display: showInput === name ? "none" : "block" }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowInput(name)
        }}
      >
        {cover}
      </div>
      <div
        className="input-actions"
        style={{ display: showInput === name ? "flex" : "none" }}
      >
        <div onClick={handleCheck}>
          <i className="far fa-check" />
        </div>
        <div onClick={handleCancel}>
          <i className="fal fa-times" />
        </div>
      </div>
      {
        loading &&
        <div className="loading-cover">
          <i className="fas fa-spinner fa-spin" />
        </div>
      }
    </label>
  )
}

export const AppCoverSelect = (props) => {

  const { options, label, onChange, value, className,
    containerStyles, showInput, setShowInput, cover,
    name, loading } = props
  const selectRef = useRef(null)

  const openSelect = (e) => {
    e.stopPropagation()
    selectRef.current.focus()
  }

  const formatOptionLabel = ({ label, icon, iconColor }) => (
    <div className="select-option">
      { 
        icon && 
        <i 
          className={icon} 
          style={{color:iconColor, marginRight: '10px'}} 
        /> 
      }
      <span>{label}</span>
    </div>
  )

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '5px',
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--grayText)',
      boxShadow: 'none',
      border: state.isFocused ? '1px solid var(--primary)' : '1px solid var(--inputBorder)',
      zIndex: state.isFocused ? '200' : '0',
      "&:hover": {
        border: state.isFocused ? '1px solid var(--primary)' : 'none',
      },
    }),
    menuPortal: base => ({ ...base, zIndex: 300 }),
    option: (base, state) => ({
      ...base,
      fontSize: '14px',
      fontWeight: '500',
      background: state.isSelected ? 'var(--inputBg)' : '#fff',
      cursor: 'pointer',
      opacity: state.isDisabled ? '0.4' : '1',
      color: 'var(--darkGrayText)',
      "&:hover": {
        background: 'var(--inputBg)'
      },
    })
  }

  useEffect(() => {
    if (showInput === name) {
      window.onclick = () => setShowInput(null)
    }
    return () => window.onclick = null
  }, [showInput])

  return (
    <label
      className={`appCoverSelect appCoverInput commonInput ${className ?? ""}`}
      style={containerStyles}
    >
      <h6>{label}</h6>
      <div
        className="select-container"
        onClick={(e) => openSelect(e)}
        style={{ display: showInput === name ? "block" : "none" }}
      >
        <Select
          onChange={(value) => onChange(value)}
          value={value}
          defaultValue={value}
          options={options}
          formatOptionLabel={formatOptionLabel}
          openMenuOnFocus
          styles={selectStyles}
          hideSelectedOptions
          menuShouldScrollIntoView
          components={{ IndicatorSeparator: () => null }}
          ref={selectRef}
          menuPortalTarget={document.body}
        />
      </div>
      <div
        className="coverInput"
        style={{ display: showInput === name ? "none" : "block" }}
        onClick={(e) => {
          e.stopPropagation()
          setShowInput(name)
        }}
      >
        {cover}
      </div>
      {
        loading &&
        <div className="loading-cover">
          <i className="fas fa-spinner fa-spin" />
        </div>
      }
    </label>
  )
}