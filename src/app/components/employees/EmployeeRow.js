import { truncateText } from "app/utils/generalUtils"
import React from 'react'
import { useNavigate } from "react-router-dom"
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function EmployeeRow(props) {

  const { employeeID, firstName, lastName, email, phone,
    address, city, region, country, position } = props.employee
  const navigate = useNavigate()

  const deleteEmployee = () => {

  }

  return (
    <AppItemRow
      item1={truncateText(employeeID, 10)}
      item2={truncateText(`${firstName} ${lastName}`, 16)}
      item3={truncateText(email, 16)}
      item4={phone}
      item5={truncateText(address, 16)}
      item6={truncateText(`${city}, ${region}`, 16)}
      item7={country}
      item8={position}
      actions={
        <>
          <IconContainer
            icon="fas fa-eye"
            tooltip="View Employee"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/employee/${employeeID}`)}
          />
          <IconContainer
            icon="fas fa-pen"
            tooltip="Edit Employee"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/employees/new?employeeID=${employeeID}&edit=true`)}
          />
          <IconContainer
            icon="fas fa-trash"
            tooltip="Delete"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => deleteEmployee()}
          />
        </>
      }
      onDoubleClick={() => navigate(`/employee/${employeeID}`)}
    />
  )
}
