export const taskPriorityOptions = [
  {
    label: 'Lowest',
    value: 'lowest',
  },
  {
    label: 'Low',
    value: 'low',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'High',
    value: 'high',
  },
  {
    label: 'Highest',
    value: 'highest',
  }
]

export const taskTypeOptions = [
  {
    label: 'Story',
    value: 'story',
  },
  {
    label: 'Feature',
    value: 'feature',
  },
  {
    label: 'Task',
    value: 'task',
  },
  {
    label: 'Bug',
    value: 'bug',
  },
  {
    label: 'Refactor',
    value: 'refactor',
  },
  {
    label: 'Test',
    value: 'test',
  },
]

export const switchTaskType = (type) => {
  if(type === 'feature') return { color: '#7cc244', icon: 'fas fa-bolt' }
  if(type === 'epic') return { color: '#f7f700', icon: 'fas fa-rocket' }
  if(type === 'bug') return { color: '#fc0349', icon: 'fas fa-bug' }
  if(type === 'refactor') return { color: '#00f2ce', icon: 'fas fa-code' }
  if(type === 'test') return { color: '#ffbf00', icon: 'fas fa-vial' }
  return { color: '#0a9bfc', icon: 'fas fa-bookmark' }
}