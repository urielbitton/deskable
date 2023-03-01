import AppBadge from "app/components/ui/AppBadge"
import AppButton from "app/components/ui/AppButton"
import DropdownIcon from "app/components/ui/DropDownIcon"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { infoToast } from "app/data/toastsTemplates"
import { useEmployee } from "app/hooks/employeeHooks"
import { useOrganization } from "app/hooks/organizationHooks"
import { removeEmployeeService } from "app/services/employeeServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { formatPhoneNumber } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import "./styles/EmployeePage.css"

export default function EmployeePage() {

  const { myOrgID, setToasts, setPageLoading } = useContext(StoreContext)
  const [showTaskMenu, setShowTaskMenu] = useState(null)
  const employeeID = useParams().employeeID
  const employee = useEmployee(employeeID)
  const organization = useOrganization(myOrgID)
  const navigate = useNavigate()

  const handleDelete = () => {
    const confirm = window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName} from your employees?`)
    if (!confirm) return setToasts(infoToast("Employee not deleted."))
    removeEmployeeService(
      myOrgID,
      employeeID,
      setPageLoading,
      setToasts
    )
  }

  return employee ? (
    <div className="employee-page">
      <HelmetTitle title={`Employee ${employee.firstName} ${employee.lastName}`} />
      <PageTitleBar
        title="Employee"
        hasBorder
        rightComponent={
          <DropdownIcon
            iconColor="var(--grayText)"
            tooltip="Actions"
            showMenu={showTaskMenu}
            setShowMenu={setShowTaskMenu}
            onClick={(e) => setShowTaskMenu(prev => !prev)}
            items={[
              { label: "New Employee", icon: "fas fa-plus", url: "/employees/new" },
              { label: "Edit", icon: "fas fa-pen", url: `/employees/new?employeeID=${employeeID}&edit=true` },
              { label: "Delete", icon: "fas fa-trash", onClick: () => handleDelete() },
            ]}
          />
        }
      />
      <div className="employee-frame">
        <div className="header">
          <div className="left-side">
            <div className="title-row">
              <h4>{employee.firstName} {employee.lastName}</h4>
              <AppBadge
                label={employee.status}
                light={false}
              />
            </div>
            <h5>{employee.position}</h5>
          </div>
          <div className="right-side">
            <AppButton
              buttonType="iconBtn small"
              leftIcon="fas fa-phone"
            />
            <AppButton
              buttonType="iconBtn small"
              leftIcon="fas fa-envelope"
            />
            <AppButton
              buttonType="iconBtn small"
              leftIcon="fas fa-comment"
            />
            <AppButton
              buttonType="iconBtn small"
              leftIcon="fas fa-video"
            />
            <AppBadge
              label={organization?.name}
              icon="fas fa-briefcase"
              light
              onClick={() => navigate(`/organization/${organization?.organizationID}`)}
            />
          </div>
        </div>
        <div className="info-container">
          <div className="column">
            <img
              src={employee.photoURL}
              alt="employee-img"
            />
          </div>
          <div className="column">
            <div className="item">
              <h6>Full Name</h6>
              <h5>{employee.firstName} {employee.lastName}</h5>
            </div>
            <div className="item">
              <h6>Email</h6>
              <h5>{employee.email}</h5>
            </div>
            <div className="item">
              <h6>Phone</h6>
              <h5>{formatPhoneNumber(employee.phone)}</h5>
            </div>
          </div>
          <div className="column">
            <div className="item">
              <h6>Employee ID</h6>
              <h5>{employee.employeeID}</h5>
            </div>
            <div className="item">
              <h6>Position</h6>
              <h5>{employee.position}</h5>
            </div>
            <div className="item">
              <h6>Date Joined</h6>
              <h5>{convertClassicDate(employee.dateJoined?.toDate())}</h5>
            </div>
          </div>
          <div className="column">
            <div className="item">
              <h6>Address</h6>
              <h5>
                {employee.address}&nbsp;
                {employee.city}, {employee.region}, {employee.country}&nbsp;
                <span className="uppercase">{employee.postCode}</span>
              </h5>
            </div>
            <div className="item">
              <h6>Years Of Experience</h6>
              <h5>{employee.yearsOfExperience}</h5>
            </div>
            <div className="item">
              <h6>Branch</h6>
              <h5>{employee.branch}</h5>
            </div>
          </div>
        </div>
        <div className="data-container">

        </div>
      </div>
    </div>
  ) :
    null
}
