import { useEffect, useRef } from 'react'

/**
 * Tracks pointer position normalized to [-1, 1] on both axes,
 * with origin at the center of the viewport.
 * Returns a ref so consumers can read it inside useFrame without
 * causing React re-renders on every mouse move.
 */
export function useMouseParallax() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function handlePointerMove(event) {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      pointer.current.x = x
      pointer.current.y = y
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return pointer
}
