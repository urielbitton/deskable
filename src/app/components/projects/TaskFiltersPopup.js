import { taskPointsOptions, switchTaskPriority, 
  switchTaskType, taskTypeOptions, 
  taskPriorityOptions } from "app/data/projectsData"
import React from 'react'
import AppButton from "../ui/AppButton"
import { AppReactSelect } from "../ui/AppInputs"
import IconContainer from "../ui/IconContainer"
import './styles/TaskFiltersPopup.css'

export default function TaskFiltersPopup(props) {

  const { showPopup, onClose, clearFilters, saveFilters,
    disableApply, taskTypeFilter, setTaskTypeFilter,
    pointsFilter, setPointsFilter, priorityFilter,
    setPriorityFilter, statusFilter, setStatusFilter,
    taskStatusOptions } = props
  const selectAllOption = { value: 'all', label: 'All', icon: 'far fa-circle', iconColor: 'var(--storyBlue)' }

  return (
    <div className={`task-filters-popup ${showPopup ? 'show' : ''}`}>
      <div className="popup-header">
        <h5>Task Filters</h5>
        <IconContainer
          icon="fal fa-times"
          onClick={() => onClose()}
          iconSize={19}
          dimensions={27}
          round={false}
        />
      </div>
      <div className="popup-content">
        <AppReactSelect
          label="Task Type"
          placeholder={
            <h5 className="placeholder cap">
              <i
                className={taskTypeFilter === 'all' ? 'far fa-circle' : switchTaskType(taskTypeFilter).icon}
                style={{ color: switchTaskType(taskTypeFilter).color }}
              />
              {taskTypeFilter}
            </h5>
          }
          options={[selectAllOption, ...taskTypeOptions]}
          onChange={(sortBy) => setTaskTypeFilter(sortBy.value)}
          value={taskTypeFilter}
        />
        <AppReactSelect
          label="Points"
          placeholder={
            <h5 className="placeholder cap">
              <i
                className={pointsFilter === 'all' ? 'far fa-circle' : 'fas fa-gamepad'}
                style={{ color: pointsFilter === 'all' ? 'var(--storyBlue)' : 'var(--grayText)' }}
              />
              {pointsFilter}
            </h5>
          }
          options={[selectAllOption, ...taskPointsOptions]}
          onChange={(sortBy) => setPointsFilter(sortBy.value)}
          value={pointsFilter}
        />
        <AppReactSelect
          label="Priority"
          placeholder={
            <h5 className="placeholder cap">
              <i
                className={priorityFilter === 'all' ? 'far fa-circle' : 'fas fa-chevron-up'}
                style={{ color: priorityFilter === 'all' ? 'var(--storyBlue)' : switchTaskPriority(priorityFilter).color }}
              />
              {priorityFilter}
            </h5>
          }
          options={[selectAllOption, ...taskPriorityOptions]}
          onChange={(sortBy) => setPriorityFilter(sortBy.value)}
          value={priorityFilter}
        />
        <AppReactSelect
          label="Task Status"
          placeholder={
            <h5 className="placeholder cap">
              <i
                className={statusFilter === 'all' ? 'far fa-circle' : 'fas fa-columns'}
                style={{ color: statusFilter === 'all' ? 'var(--storyBlue)' : 'var(--grayText)' }}
              />
              {statusFilter}
            </h5>
          }
          options={[selectAllOption, ...taskStatusOptions]}
          onChange={(sortBy) => setStatusFilter(sortBy.value)}
          value={statusFilter}
        />
      </div>
      <div className="popup-footer">
        <AppButton
          label="Clear Filters"
          buttonType="tabBtn small"
          leftIcon="fal fa-times"
          onClick={() => clearFilters()}
        />
        <AppButton
          label="Apply"
          leftIcon="fas fa-filter"
          onClick={() => saveFilters()}
          buttonType="small"
          disabled={disableApply}
        />
      </div>
    </div>
  )
}
