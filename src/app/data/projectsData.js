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