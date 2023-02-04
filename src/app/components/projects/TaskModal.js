import React from 'react'
import AppModal from "../ui/AppModal"
import './styles/TaskModal.css'

export default function TaskModal(props) {

  const { showModal, setShowModal, label } = props

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label={label}
    >

    </AppModal>
  )
}
