export const infoToast = (message, keep) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-exclamation-circle',
    toastID: Date.now(),
    keep
  }]
}

export const errorToast = (message, keep) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-times-circle',
    toastID: Date.now(),
    keep
  }]
}

export const successToast = (message, keep) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-check-circle',
    toastID: Date.now(),
    keep
  }]
}
