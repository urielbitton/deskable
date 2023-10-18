import { useEffect, useState } from "react"

export const useIsFullScreen = () => {
  
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const fullScreenDetect = () => {
      window.addEventListener('resize', () => {
        if (window.screenTop || window.screenY) {
          setIsFullScreen(true)
        }
        else {
          setIsFullScreen(false)
        }
      })
    }
    fullScreenDetect()
    return () => fullScreenDetect()
  }, [])

  return isFullScreen
}

export const usePageVisibility = () => {

  const [isVisible, setIsVisible] = useState(true)

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return isVisible
}