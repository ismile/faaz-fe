import { useState, useEffect } from 'react'

export function useWindowResize() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const listener = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)


  console.log(window.innerWidth)
  }

  useEffect(() => {
    listener()
    window.addEventListener('resize', listener)
    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])


  return {
    hTable: height-200,
    wTable: width-75,
    width,
    height,
  }
}
