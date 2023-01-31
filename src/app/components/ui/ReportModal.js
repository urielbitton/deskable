import { infoToast } from "app/data/toastsTemplates"
import { createReportService } from "app/services/reportsServices"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "./AppButton"
import { AppSelect, AppTextarea } from "./AppInputs"
import AppModal from "./AppModal"
import './styles/ReportModal.css'

export default function ReportModal(props) {

  const { myUserID, myOrgID, setToasts } = useContext(StoreContext)
  const { showModal, setShowModal, reportReason, setReportReason,
    reportMessage, setReportMessage, loading, setLoading,
    reportOptions, reportedContent } = props
  const allowSubmit = reportReason && reportMessage

  const resetReportInfo = () => {
    setReportReason("")
    setReportMessage("")
    setShowModal(false)
  }

  const submitReport = () => {
    if (!!!allowSubmit) return setToasts(infoToast("Please fill out all the fields to submitting your report."))
    createReportService(
      myUserID,
      myOrgID,
      reportReason,
      reportMessage,
      reportedContent,
      setLoading,
      setToasts
    )
      .then(() => {
        resetReportInfo()
      })
  }

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label="Report Post"
      portalClassName="report-post-modal"
      actions={
        <>
          <AppButton
            label="Submit"
            onClick={submitReport}
            rightIcon={loading ? 'fas fa-spinner fa-spin' : null}
          />
          <AppButton
            label="Cancel"
            onClick={resetReportInfo}
            buttonType="outlineBtn"
          />
        </>
      }
    >
      <div className="form">
        <AppSelect
          Label="Reason for reporting"
          options={reportOptions}
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
        <AppTextarea
          Label="Message"
          placeholder="Write a message to the organization admin..."
          value={reportMessage}
          onChange={(e) => setReportMessage(e.target.value)}
        />
        {
          reportedContent &&
          <div className="reported-content">
            <h5>Reported Content:</h5>
            <q>{reportedContent}</q>
          </div>
        }
      </div>
    </AppModal>
  )
}
