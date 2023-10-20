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

export const useScreenHeight = () => {

  const [screenHeight, setScreenHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  return screenHeight
}

export const useInViewport = (ref, elemScrollRef, offset) => {

    const [inView, setInView] = useState(false)
    
    const isInView = () => {
      const rect = ref?.current?.getBoundingClientRect()
      return (
        rect.top >= offset &&
        rect.left >= offset &&
        rect.bottom <= (window.innerHeight || elemScrollRef?.current?.clientHeight) &&
        rect.right <= (window.innerWidth || elemScrollRef?.current?.clientWidth)
      )
    } 
  
    useEffect(() => {
      const scrollHandler = () => {
        setInView(isInView())
      }
      elemScrollRef?.current?.addEventListener('scroll', scrollHandler)
      return () => elemScrollRef?.current?.removeEventListener('scroll', scrollHandler)
    })

    return inView
}

