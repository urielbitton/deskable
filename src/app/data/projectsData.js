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
    iconColor: 'var(--storyBlue)',
  },
  {
    label: 'Feature',
    value: 'feature',
    icon: 'fas fa-bolt',
    iconColor: 'var(--featureGreen)'
  },
  {
    label: 'Epic',
    value: 'epic',
    icon: 'fas fa-rocket',
    iconColor: 'var(--epicPurple)'
  },
  {
    label: 'Bug',
    value: 'bug',
    icon: 'fas fa-bug',
    iconColor: 'var(--bugRed)',
  },
  {
    label: 'Refactor',
    value: 'refactor',
    icon: 'fas fa-code',
    iconColor: 'var(--refactorViolet)',
  },
  {
    label: 'Test',
    value: 'test',
    icon: 'fas fa-vial',
    iconColor: 'var(--testOrange)',
  },
]


export const switchTaskType = (type) => {
  if (type === 'story') return { color: 'var(--storyBlue)', icon: 'fas fa-bookmark' }
  if (type === 'feature') return { color: 'var(--featureGreen)', icon: 'fas fa-bolt' }
  if (type === 'epic') return { color: 'var(--epicPurple)', icon: 'fas fa-rocket' }
  if (type === 'bug') return { color: 'var(--bugRed)', icon: 'fas fa-bug' }
  if (type === 'refactor') return { color: 'var(--refactorViolet)', icon: 'fas fa-code' }
  if (type === 'test') return { color: 'var(--testOrange)', icon: 'fas fa-vial' }
  return { color: 'var(--storyBlue)', icon: 'fas fa-bookmark' }
}

export const switchTaskPriority = (priority) => {
  if (priority === 'lowest') return { color: '#1971ff', icon: 'fas fa-chevron-double-down', level: 0 }
  if (priority === 'low') return { color: '#17c1ff', icon: 'fas fa-chevron-down', level: 1 }
  if (priority === 'medium') return { color: '#ffd30d', icon: 'fas fa-grip-lines', level: 2 }
  if (priority === 'high') return { color: '#ff8800', icon: 'fas fa-chevron-up', level: 3 }
  if (priority === 'highest') return { color: '#ff2a00', icon: 'fas fa-chevron-double-up', level: 4 }
  return { color: '#ffd30d', icon: 'fas fa-grip-lines', level: 2 }
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

export const taskPointsOptions = [
  {
    label: '0',
    value: 0,
    icon: 'fas fa-gamepad',
    iconColor: 'var(--grayText)'
  },
  {
    label: '1',
    value: 1,
    icon: 'fas fa-gamepad',
    iconColor: 'var(--grayText)'
  },
  {
    label: '2',
    value: 2,
    icon: 'fas fa-gamepad',
    iconColor: 'var(--grayText)'
  },
  {
    label: '3',
    value: 3,
    icon: 'fas fa-gamepad',
    iconColor: 'var(--grayText)'
  },
  {
    label: '4',
    value: 4,
    icon: 'fas fa-gamepad',
    iconColor: 'var(--grayText)'
  },
  {
    label: '5',
    value: 5,
    icon: 'fas fa-gamepad',
    iconColor: 'var(--grayText)'
  }
]

export const recentTasksSortByOptions = [
  {
    label: 'Date Modified',
    value: 'dateModified',
    icon: 'fas fa-calendar-alt',
  },
  {
    label: 'Priority',
    value: 'priority',
    icon: 'fas fa-chevron-double-up',
  },
  {
    label: 'Points',
    value: 'points',
    icon: 'fas fa-gamepad',
  }
] 

export const recentTasksSortBySwitch = (sortBy) => {
  if (sortBy === 'dateModified') return {name: 'Date Modified', icon: 'fas fa-calendar-alt'}
  if (sortBy === 'priority') return {name: 'Priority', icon: 'fas fa-chevron-double-up'}
  if (sortBy === 'points') return {name: 'Points', icon: 'fas fa-gamepad'}
  return {name: 'Date Modified', icon: 'fas fa-calendar-alt'}
}

export const projectPagesTypesOptions = [
  {
    label: 'Guide',
    value: 'guide',
    icon: 'fas fa-book',
  },
  {
    label: 'FAQ',
    value: 'faq',
    icon: 'fas fa-question',
  },
  {
    label: 'Documentation',
    value: 'documentation',
    icon: 'fas fa-file-alt',
  },
  {
    label: 'Project Plan',
    value: 'projectPlan',
    icon: 'fas fa-tasks',
  },
  {
    label: 'Status Report',
    value: 'statusReport',
    icon: 'fas fa-chart-line',
  },
  {
    label: 'Meeting Notes',
    value: 'meetingNotes',
    icon: 'fas fa-sticky-note',
  },
  {
    label: 'Other',
    value: 'other',
    icon: 'far fa-circle',
  }
]

export const switchProjectPagesTypes = (type) => {
  if (type === 'guide') return {name: 'Guide', icon: 'fas fa-book'}
  if (type === 'faq') return {name: 'FAQ', icon: 'fas fa-question'}
  if (type === 'documentation') return {name: 'Documentation', icon: 'fas fa-file-alt'}
  if (type === 'projectPlan') return {name: 'Project Plan', icon: 'fas fa-tasks'}
  if (type === 'statusReport') return {name: 'Status Report', icon: 'fas fa-chart-line'}
  if (type === 'meetingNotes') return {name: 'Meeting Notes', icon: 'fas fa-sticky-note'}
  if (type === 'other') return {name: 'Other', icon: 'far fa-circle'}
  return {name: 'Other', icon: 'far fa-circle'} 
}

export const projectAvatarsList = [
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-1.png?alt=media&token=01fb1ae4-2d21-4f72-9ffd-d46c13868ac7',
    alt: 'Project Avatar 1'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-2.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 2'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-3.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 3'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-4.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 4'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-5.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 5'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-6.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 6'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-7.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 7'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-8.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 8'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-9.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 9'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-10.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 10'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-11.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 11'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-12.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 12'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-13.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 13'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-14.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 14'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-15.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 15'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-16.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 16'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fproject-avatars%2Fproject-avatar-17.png?alt=media&token=4b8b0b8f-8f9f-4f9f-9f9f-8f9f4f9f9f9f',
    alt: 'Project Avatar 17'
  }
]