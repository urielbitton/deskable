import { tasksAscIndex, tasksIndex, tasksPointsAscIndex, tasksPointsDescIndex, tasksPriorityAscIndex, tasksPriorityDescIndex, tasksStatusDescIndex, tasksTitleAscIndex, tasksTitleDescIndex, tasksTypeDescIndex } from "app/algolia"

export const taskPriorityOptions = [
  {
    label: 'Lowest',
    value: 'lowest',
    icon: 'fas fa-chevron-double-down',
    iconColor: '#1971ff',
  },
  {
    label: 'Low',
    value: 'low',
    icon: 'fas fa-chevron-down',
    iconColor: '#17c1ff',
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: 'fas fa-grip-lines',
    iconColor: '#ffd30d',
  },
  {
    label: 'High',
    value: 'high',
    icon: 'fas fa-chevron-up',
    iconColor: '#ff8800',
  },
  {
    label: 'Highest',
    value: 'highest',
    icon: 'fas fa-chevron-double-up',
    iconColor: '#ff2a00',
  }
]

export const taskTypeOptions = [
  {
    label: 'Story',
    value: 'story',
    icon: 'fas fa-bookmark',
    iconColor: '#0a9bfc',
  },
  {
    label: 'Feature',
    value: 'feature',
    icon: 'fas fa-bolt',
    iconColor: '#7cc244',
  },
  {
    label: 'Epic',
    value: 'epic',
    icon: 'fas fa-rocket',
    iconColor: '#b603fc',
  },
  {
    label: 'Bug',
    value: 'bug',
    icon: 'fas fa-bug',
    iconColor: '#fc0349',
  },
  {
    label: 'Refactor',
    value: 'refactor',
    icon: 'fas fa-code',
    iconColor: '#622eff',
  },
  {
    label: 'Test',
    value: 'test',
    icon: 'fas fa-vial',
    iconColor: '#ffbf00',
  },
]


export const switchTaskType = (type) => {
  if (type === 'story') return { color: '#0a9bfc', icon: 'fas fa-bookmark' }
  if (type === 'feature') return { color: '#7cc244', icon: 'fas fa-bolt' }
  if (type === 'epic') return { color: '#b603fc', icon: 'fas fa-rocket' }
  if (type === 'bug') return { color: '#fc0349', icon: 'fas fa-bug' }
  if (type === 'refactor') return { color: '#622eff', icon: 'fas fa-code' }
  if (type === 'test') return { color: '#ffbf00', icon: 'fas fa-vial' }
  return { color: '#0a9bfc', icon: 'fas fa-bookmark' }
}

export const switchTaskPriority = (priority) => {
  if (priority === 'lowest') return { color: '#1971ff', icon: 'fas fa-chevron-double-down' }
  if (priority === 'low') return { color: '#17c1ff', icon: 'fas fa-chevron-down' }
  if (priority === 'medium') return { color: '#ffd30d', icon: 'fas fa-grip-lines' }
  if (priority === 'high') return { color: '#ff8800', icon: 'fas fa-chevron-up' }
  if (priority === 'highest') return { color: '#ff2a00', icon: 'fas fa-chevron-double-up' }
  return { color: '#ffd30d', icon: 'fas fa-grip-lines' }
}

export const projectColumnsOptions = (columns) => {
  return columns?.map((column) => {
    return {
      label: column.title,
      value: column.title,
      icon: 'fas fa-columns'
    }
  })
}

export const projectTypeOptions = [
  {
    label: 'Administrator Based',
    value: 'admin',
    icon: 'fas fa-user-shield',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Team Based',
    value: 'team',
    icon: 'fas fa-users',
    iconColor: 'var(--grayText)'
  }
]

export const switchProjectType = (type) => {
  if (type === 'admin') return { icon: 'fas fa-user-shield' }
  if (type === 'team') return { icon: 'fas fa-users' }
  return { icon: 'fas fa-user-shield' }
}

export const projectAccessOptions = [
  {
    label: 'Open',
    value: 'open',
    icon: 'fas fa-unlock',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Invite Only',
    value: 'invite',
    icon: 'fas fa-lock',
    iconColor: 'var(--grayText)'
  }
]

export const switchProjectAccess = (access) => {
  if (access === 'open') return { icon: 'fas fa-unlock' }
  if (access === 'invite') return { icon: 'fas fa-lock' }
  return { icon: 'fas fa-unlock' }
}

export const projectCategoriesOptions = [
  {
    label: 'Software',
    value: 'software',
    icon: 'fas fa-code',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Marketing',
    value: 'marketing',
    icon: 'fas fa-bullhorn',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Multimedia',
    value: 'multimedia',
    icon: 'fas fa-photo-video',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Design',
    value: 'design',
    icon: 'fas fa-palette',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Sales',
    value: 'sales',
    icon: 'fas fa-chart-line',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Finance',
    value: 'finance',
    icon: 'fas fa-chart-pie',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Human Resources',
    value: 'human resources',
    icon: 'fas fa-user-tie',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Legal',
    value: 'legal',
    icon: 'fas fa-gavel',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'analytics',
    value: 'analytics',
    icon: 'fas fa-chart-bar',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'IT',
    value: 'it',
    icon: 'fas fa-server',
    iconColor: 'var(--grayText)'
  },
  {
    label: 'Other',
    value: 'other',
    icon: 'far fa-circle',
    iconColor: 'var(--grayText)'
  }
]

export const switchProjectCategory = (category) => {
  if (category === 'software') return { icon: 'fas fa-code' }
  if (category === 'marketing') return { icon: 'fas fa-bullhorn' }
  if (category === 'multimedia') return { icon: 'fas fa-photo-video' }
  if (category === 'design') return { icon: 'fas fa-palette' }
  if (category === 'sales') return { icon: 'fas fa-chart-line' }
  if (category === 'finance') return { icon: 'fas fa-chart-pie' }
  if (category === 'human resources') return { icon: 'fas fa-user-tie' }
  if (category === 'legal') return { icon: 'fas fa-gavel' }
  if (category === 'analytics') return { icon: 'fas fa-chart-bar' }
  if (category === 'it') return { icon: 'fas fa-server' }
  if (category === 'other') return { icon: 'fas fa-ellipsis-h' }
  return { icon: 'far fa-circle' }
}

export const projectTasksSortByOptions = [
  {
    label: 'Date Created (Desc.)',
    value: 'dateCreated',
    icon: 'fas fa-calendar-alt',
  },
  {
    label: 'Date Created (Asc.)',
    value: 'dateCreated-asc',
    icon: 'fas fa-calendar-alt',
  },
  {
    label: 'Points (Desc.)',
    value: 'points-desc',
    icon: 'fas fa-gamepad',
  },
  {
    label: 'Points (Asc.)',
    value: 'points-asc',
    icon: 'fas fa-gamepad',
  },
  {
    label: 'Task Type (Desc.)',
    value: 'type-desc',
    icon: 'fas fa-bolt',
  },
  {
    label: 'Priority (Desc.)',
    value: 'priority-desc',
    icon: 'fas fa-chevron-double-down',
  },
  {
    label: 'Priority (Asc.)',
    value: 'priority-asc',
    icon: 'fas fa-chevron-double-up',
  },
  {
    label: 'Status (Desc.)',
    value: 'status-desc',
    icon: 'fas fa-columns',
  },
  {
    label: 'Title (Desc.)',
    value: 'title',
    icon: 'fas fa-sort-alpha-down',
  },
  {
    label: 'Title (Asc.)',
    value: 'title-asc',
    icon: 'fas fa-sort-alpha-up',
  }
]

export const projectTasksSortBySwitch = (sortBy) => {
  if (sortBy === 'dateCreated') return {index: tasksIndex, name: 'Date Created (Desc.)', icon: 'fas fa-calendar-alt'}
  if (sortBy === 'dateCreated-asc') return {index: tasksAscIndex, name: 'Date Created (Asc.)', icon: 'fas fa-calendar-alt'}
  if (sortBy === 'points-desc') return {index: tasksPointsDescIndex, name: 'Points (Desc.)', icon: 'fas fa-gamepad'}
  if (sortBy === 'points-asc') return {index: tasksPointsAscIndex, name: 'Points (Asc.)', icon: 'fas fa-gamepad'}
  if (sortBy === 'type-desc') return {index: tasksTypeDescIndex, name: 'Task Type (Desc.)', icon: 'fas fa-bolt'}
  if (sortBy === 'priority-desc') return {index: tasksPriorityDescIndex, name: 'Priority (Desc.)', icon: 'fas fa-chevron-double-down'}
  if (sortBy === 'priority-asc') return {index: tasksPriorityAscIndex, name: 'Priority (Asc.)', icon: 'fas fa-chevron-double-up'}
  if (sortBy === 'status-desc') return {index: tasksStatusDescIndex, name: 'Status (Desc.)', icon: 'fas fa-columns'}
  if (sortBy === 'title-desc') return {index: tasksTitleDescIndex, name: 'Title (Desc.)', icon: 'fas fa-sort-alpha-down'}
  if (sortBy === 'title-asc') return {index: tasksTitleAscIndex, name: 'Title (Asc.)', icon: 'fas fa-sort-alpha-up'}
  return {index: tasksIndex, name: 'Date Created (Desc.)', icon: 'fas fa-calendar-alt'}
}