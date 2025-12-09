import { useEffect } from "react"

/**
 * Hook to handle Escape key press
 * @param callback Function to call when Escape key is pressed
 * @param enabled Optional flag to enable/disable the listener, defaults to true
 */
export function useEsc(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [callback, enabled])
}
