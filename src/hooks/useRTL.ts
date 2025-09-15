import { useState, useEffect, useCallback } from 'react'

interface UseRTLReturn {
  direction: 'ltr' | 'rtl'
  setDirection: (direction: 'ltr' | 'rtl') => void
  isRTL: boolean
  toggleDirection: () => void
}

/**
 * Hook for managing RTL (Right-to-Left) direction state
 * Provides utilities for handling text direction and layout
 */
export function useRTL(): UseRTLReturn {
  const [direction, setDirectionState] = useState<'ltr' | 'rtl'>(
    document.documentElement.dir as 'ltr' | 'rtl' || 'rtl'
  )

  const setDirection = useCallback((newDirection: 'ltr' | 'rtl') => {
    setDirectionState(newDirection)
    document.documentElement.dir = newDirection
    
    // Update CSS custom property for dynamic styling
    document.documentElement.style.setProperty('--direction', newDirection)
    
    // Trigger custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('directionChange', { 
      detail: { direction: newDirection } 
    }))
  }, [])

  const toggleDirection = useCallback(() => {
    const newDirection = direction === 'rtl' ? 'ltr' : 'rtl'
    setDirection(newDirection)
  }, [direction, setDirection])

  const isRTL = direction === 'rtl'

  // Listen for external direction changes
  useEffect(() => {
    const handleDirectionChange = (event: CustomEvent) => {
      const { direction: newDirection } = event.detail
      if (newDirection !== direction) {
        setDirectionState(newDirection)
      }
    }

    window.addEventListener('directionChange', handleDirectionChange as EventListener)
    
    return () => {
      window.removeEventListener('directionChange', handleDirectionChange as EventListener)
    }
  }, [direction])

  return {
    direction,
    setDirection,
    isRTL,
    toggleDirection
  }
}
