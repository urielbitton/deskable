import { infoToast } from "app/data/toastsTemplates"
import { createEventService, deleteEventService } from "app/services/eventsServices"
import { StoreContext } from "app/store/store"
import { convertDateToInputDateAndTimeFormat, convertDateToInputFormat } from "app/utils/dateUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppSwitch, AppTextarea } from "../ui/AppInputs"
import './styles/NewEventModal.css'

export default function NewEventModal() {

  const { newEventModal, setNewEventModal, myUserID, 
    setToasts, setPageLoading } = useContext(StoreContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startingDate, setStartingDate] = useState('')
  const [endingDate, setEndingDate] = useState('null')
  const [allDay, setAllDay] = useState(false)

  const allowSave = title && description && startingDate && endingDate

  const createEvent = () => {
    if(!!!allowSave) return setToasts(infoToast('Please fill all the fields.'))
    createEventService(
      myUserID, 
      {
        title,
        description,
        startingDate: new Date(startingDate),
        endingDate: new Date(endingDate),
        allDay
      }, 
      setToasts, setPageLoading)
    .then(() => {
      setNewEventModal({ open: false, eventObject: null })
    })
  }

  const deleteEvent = () => {
    const confirm = window.confirm('Are you sure you want to delete this event?')
    if (!confirm) return setToasts(infoToast('Event not deleted.'))
    deleteEventService(
      myUserID, 
      newEventModal.eventObject.eventID, 
      setToasts, 
      setPageLoading
    )
    .then(() => {
      setNewEventModal({ open: false, eventObject: null })
    })
  }

  useEffect(() => {
    if (newEventModal.eventObject) {
      setTitle(newEventModal?.eventObject?.title)
      setDescription(newEventModal?.eventObject?.description)
      if (allDay) {
        setStartingDate(convertDateToInputFormat(newEventModal?.eventObject?.startingDate))
        setEndingDate(convertDateToInputFormat(newEventModal?.eventObject?.endingDate))
      }
      else {
        setStartingDate(convertDateToInputDateAndTimeFormat((newEventModal?.eventObject?.startingDate)))
        setEndingDate(convertDateToInputDateAndTimeFormat((newEventModal?.eventObject?.endingDate)))
      }
    }
  }, [newEventModal, allDay])

  useEffect(() => {
    setAllDay(newEventModal?.eventObject?.allDay)
  }, [newEventModal])


  return (
    <div
      className={`new-event-modal ${newEventModal.open ? 'show' : ''}`}
      onClick={() => setNewEventModal({ open: false, eventObject: null })}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <h4>New Event</h4>
        <AppInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <AppTextarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <AppInput
          label="Starting Date"
          type={allDay ? "date" : "datetime-local"}
          value={startingDate}
          onChange={(e) => setStartingDate((e.target.value))}
        />
        {
          !allDay &&
          <AppInput
            label="Ending Date"
            type="datetime-local"
            value={endingDate}
            onChange={(e) => setEndingDate((e.target.value))}
          />
        }
        <AppSwitch
          label="All Day"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
        />
        <div className="btn-group">
          <AppButton
            label="Save & Close"
            onClick={() => createEvent()}
            disabled={!!!allowSave}
          />
          <AppButton
            label="Cancel"
            buttonType="outlineBtn"
            onClick={() => setNewEventModal({ open: false, eventObject: null })}
          />
          {
            newEventModal?.eventObject?.editMode &&
            <AppButton
              label="Delete"
              buttonType="outlineRedBtn"
              onClick={() => deleteEvent()}
            />
          }
        </div>
      </div>
    </div>
  )
}
