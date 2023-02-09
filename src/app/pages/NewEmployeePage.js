import DropdownIcon from "app/components/ui/DropDownIcon"
import PageTitleBar from "app/components/ui/PageTitleBar"
import React, { useContext, useEffect, useRef, useState } from 'react'
import AppCard from "app/components/ui/AppCard"
import { AppInput, AppSelect } from "app/components/ui/AppInputs"
import './styles/NewEmployeePage.css'
import AvatarUploader from "app/components/ui/AvatarUploader"
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEmployee } from "app/hooks/employeeHooks"
import { StoreContext } from "app/store/store"
import { infoToast, successToast } from "app/data/toastsTemplates"
import { createEmployeeService, deleteEmployeeService, updateEmployeeService } from "app/services/employeeServices"
import { validateEmail, validatePhone } from "app/utils/generalUtils"
import { employeeStatusOptions } from "app/data/general"
import { convertDateToInputFormat, convertInputDateToDateFormat } from "app/utils/dateUtils"
import CountryStateCity from "app/components/ui/CountryStateCity"

export default function NewEmployeePage() {

  const { myOrgID, setToasts, pageLoading, setPageLoading } = useContext(StoreContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get('edit') === 'true'
  const editEmployeeID = searchParams.get('employeeID')
  const editEmployee = useEmployee(myOrgID, editEmployeeID)
  const [showTaskMenu, setShowTaskMenu] = useState(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [position, setPosition] = useState("")
  const [branch, setBranch] = useState("")
  const [status, setStatus] = useState("active")
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [dateJoined, setDateJoined] = useState('')
  const [photoURL, setPhotoURL] = useState("")
  const [uploadedImg, setUploadedImg] = useState(null)
  const [imgLoading, setImgLoading] = useState(false)
  const uploadRef = useRef(null)
  const navigate = useNavigate()

  const allowSave = firstName && lastName
    && validateEmail(email)
    && validatePhone(phone)
    && address && city && region && postalCode && country
    && position && branch && status

  const preHandle = () => {
    if (!!!allowSave) return setToasts(infoToast("Please fill all the required fields"))
    if (pageLoading) return
    setPageLoading(true)
  }

  const handleCreate = () => {
    preHandle()
    createEmployeeService(
      myOrgID,
      uploadedImg,
      {
        firstName, lastName, email, phone,
        address, postalCode, position,
        country: country.split(',')[0],
        countryCode: country.split(',')[1],
        region: region.split(',')[0],
        regionCode: region.split(',')[1],
        city, branch, status,
        yearsOfExperience: +yearsOfExperience,
        dateJoined: convertInputDateToDateFormat(dateJoined)
      },
      setToasts,
      setPageLoading
    )
      .then((employeeID) => {
        setToasts(successToast("Employee created successfully."))
        setPageLoading(false)
        navigate(`/employees/${employeeID}`)
      })
  }

  const handleUpdate = () => {
    preHandle()
    updateEmployeeService(
      myOrgID,
      uploadedImg,
      editEmployeeID,
      {
        firstName, lastName, email, phone,
        address, postalCode, position,
        country: country.split(',')[0],
        countryCode: country.split(',')[1],
        region: region.split(',')[0],
        regionCode: region.split(',')[1],
        city, branch, status, photoURL,
        yearsOfExperience: +yearsOfExperience,
        dateModified: new Date(),
        dateJoined: convertInputDateToDateFormat(dateJoined)
      },
      setPageLoading,
      setToasts
    )
      .then(() => {
        navigate(`/employees/${editEmployeeID}`)
      })
  }

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this employee?")
    if (!confirm) return setToasts(infoToast("Employee not deleted"))
    setPageLoading(true)
    deleteEmployeeService(
      myOrgID,
      editEmployeeID,
      setPageLoading,
      setToasts
    )
      .then(() => {
        navigate('/employees')
      })
  }

  const handleRemoveUpload = () => {
    setUploadedImg(null)
    uploadRef.current.value = null
  }

  useEffect(() => {
    if (editMode && editEmployee) {
      setFirstName(editEmployee.firstName)
      setLastName(editEmployee.lastName)
      setEmail(editEmployee.email)
      setPhone(editEmployee.phone)
      setAddress(editEmployee.address)
      setCountry(`${editEmployee.country},${editEmployee.countryCode}`)
      setRegion(`${editEmployee.region},${editEmployee.regionCode}`)
      setCity(editEmployee.city)
      setPostalCode(editEmployee.postalCode)
      setPosition(editEmployee.position)
      setBranch(editEmployee.branch)
      setStatus(editEmployee.status)
      setYearsOfExperience(editEmployee.yearsOfExperience)
      setPhotoURL(editEmployee.photoURL)
      setDateJoined(convertDateToInputFormat(editEmployee.dateJoined?.toDate()))
    }
  }, [editMode, editEmployee])

  return (
    <div className="new-employee-page">
      <HelmetTitle title={`${!editMode ? 'Update' : 'Create'} Employee`} />
      <div className="header">
        <PageTitleBar
          title="New Employee"
          hasBorder
          rightComponent={
            <DropdownIcon
              iconColor="var(--grayText)"
              tooltip="Actions"
              showMenu={showTaskMenu}
              setShowMenu={setShowTaskMenu}
              onClick={(e) => setShowTaskMenu(prev => !prev)}
              items={[
                { label: !editMode ? 'Create' : 'Save', icon: `fas fa-${!editMode ? 'fas fa-user-plus' : 'fas fa-save'}`, onClick: () => !editMode ? handleCreate() : handleUpdate() },
                { label: "Cancel", icon: "fas fa-times", onClick: () => navigate(-1) },
                { label: "Delete Employee", icon: "fas fa-trash", onClick: () => handleDelete() },
              ]}
            />
          }
        />
      </div>
      <AppCard
        withBorder
        padding="25px"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="avatar-row">
            <div className="left">
              <h6>Contact Photo</h6>
              <AvatarUploader
                src={uploadedImg?.src || photoURL}
                dimensions={130}
                setLoading={setImgLoading}
                uploadedImg={uploadedImg}
                setUploadedImg={setUploadedImg}
                uploadRef={uploadRef}
              />
            </div>
            <div className="right">
              {
                uploadedImg &&
                <AppButton
                  label="Remove"
                  buttonType="outlineBtn"
                  onClick={() => handleRemoveUpload()}
                />
              }
            </div>
          </div>
          <AppInput
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <AppInput
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <AppInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AppInput
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <AppInput
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <CountryStateCity
            country={country}
            setCountry={setCountry}
            region={region}
            setRegion={setRegion}
            city={city}
            setCity={setCity}
          />
          <AppInput
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <AppInput
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <AppInput
            label="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <AppInput
            label="Date Joined"
            type="date"
            value={dateJoined}
            onChange={(e) => setDateJoined(e.target.value)}
          />
          <AppSelect
            options={employeeStatusOptions}
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <AppInput
            label="Years of Experience"
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
          />
        </form>
        <div className="btn-group">
          <AppButton
            label={!editMode ? 'Create' : 'Update'}
            onClick={() => !editMode ? handleCreate() : handleUpdate()}
            disabled={!!!allowSave || imgLoading}
          />
          <AppButton
            label="Cancel"
            buttonType="outlineBtn"
            onClick={() => navigate(-1)}
          />
        </div>
      </AppCard>
    </div>
  )
}
