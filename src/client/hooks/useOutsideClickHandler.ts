import { useEffect, useRef } from 'react'

export function useOutsideClickHandler<T extends Element>(onOutsideClick: (event: MouseEvent) => void, dep?: any[]) {
  const domRef = useRef<T>(null)
  let isMouseDownOutside = useRef<boolean>(false)

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (event.target instanceof Element && domRef.current && !domRef.current.contains(event.target)) {
        isMouseDownOutside.current = true
      } else {
        isMouseDownOutside.current = false
      }
    }

    function handleMouseUp(event: MouseEvent) {
      if (
        isMouseDownOutside.current === true &&
        event.target instanceof Element &&
        domRef.current &&
        !domRef.current.contains(event.target)
      ) {
        setTimeout(() => onOutsideClick(event), 0)
      }
      isMouseDownOutside.current = false
    }

    window.document.addEventListener('mousedown', handleMouseDown)
    window.document.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.document.removeEventListener('mousedown', handleMouseDown)
      window.document.removeEventListener('mouseup', handleMouseUp)
    }
  }, dep)

  return domRef
}
