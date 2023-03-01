import { infoToast } from "app/data/toastsTemplates"
import { removeEmployeeService } from "app/services/employeeServices"
import { StoreContext } from "app/store/store"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function EmployeeRow(props) {

  const { setToasts, myOrgID, setPageLoading } = useContext(StoreContext)
  const { userID, firstName, lastName, email, phone,
    address, city, region, country, position } = props.employee
  const navigate = useNavigate()

  const removeEmployee = () => {
    const confirm = window.confirm(`Are you sure you want to delete ${firstName} ${lastName} from your employees?`)
    if (!confirm) return setToasts(infoToast("Employee not deleted."))
    removeEmployeeService(
      myOrgID,
      userID,
      setPageLoading,
      setToasts
    )
  }

  return (
    <AppItemRow
      item1={truncateText(userID, 10)}
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
            icon="fas fa-pen"
            tooltip="Edit Employee"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/employees/new?employeeID=${userID}&edit=true`)}
          />
          <IconContainer
            icon="fas fa-trash"
            tooltip="Delete"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => removeEmployee()}
          />
        </>
      }
      onClick={() => navigate(`/employees/${userID}`)}
    />
  )
}
