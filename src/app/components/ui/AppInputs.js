// @ts-nocheck
import React, { useEffect } from 'react'
import './styles/AppInputs.css'

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
    title, type, showInput, setShowInput, cover } = props

  useEffect(() => {
    if (showInput) {
      window.onclick = () => setShowInput(false)
    }
    return () => window.onclick = null
  }, [showInput])

  return (
    <label
      className={`appCoverInput commonInput ${className ?? ""}`}
      title={title ?? ""}
    >
      {label && <h6>{label}</h6>}
      {
        showInput ?
          <>
            <input
              onChange={(e) => onChange(e)}
              value={value}
              onClick={(e) => e.stopPropagation()}
              type={type}
            />
            {iconright}
            {iconleft}
          </> :
          <div
            className="coverInput"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowInput(true)
            }}
          >
            {cover}
          </div>
      }
    </label>
  )
}

export const AppCoverSelect = (props) => {

  const { options, label, onChange, value, className,
    containerStyles, showInput, setShowInput, cover } = props

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

  useEffect(() => {
    if (showInput) {
      window.onclick = () => setShowInput(false)
    }
    return () => window.onclick = null
  }, [showInput])

  return (
    <label
      className={`appCoverSelect appCoverInput commonInput ${className ?? ""}`}
      style={containerStyles}
    >
      <h6>{label}</h6>
      <select
        onChange={(e) => onChange(e)}
        value={value}
        onClick={(e) => e.stopPropagation()}
        style={{ display: showInput ? "block" : "none" }}
      >
        {optionsdata}
      </select>
      <div
        className="coverInput"
        style={{ display: showInput ? "none" : "block" }}
        onClick={(e) => {
          e.stopPropagation()
          setShowInput(true)
        }}
      >
        {cover}
      </div>
    </label>
  )
}