"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { gsap, ScrollTrigger, useGSAP } from "@/components/gsap"
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger"

export type ScrollDirection = "vertical" | "horizontal"

export interface UseSectionTrackerOptions {
  /**
   * Callback when active section changes (useful for lifting state up)
   */
  onSectionChange?: (sectionId: string) => void
  /**
   * Scroll direction for detection
   * @default "vertical"
   */
  direction?: ScrollDirection
  /**
   * Container animation for horizontal pinned scroll (only used when direction is "horizontal")
   */
  containerAnimation?: gsap.core.Tween | null
  /**
   * Custom start position (defaults based on direction: "top center" for vertical, "left center" for horizontal)
   */
  start?: string
  /**
   * Custom end position (defaults based on direction: "bottom center" for vertical, "right center" for horizontal)
   */
  end?: string
  /**
   * Whether to enable automatic trigger setup (set to false if you want to manually call setupTriggers)
   * @default true
   */
  autoSetup?: boolean
  /**
   * Scope ref for GSAP context (required for automatic cleanup with useGSAP)
   */
  scope?: React.RefObject<HTMLElement | null>
}

export interface UseSectionTrackerReturn {
  /**
   * Currently active section ID
   */
  activeSection: string | null
  /**
   * Manually set the active section (useful for horizontal scroll where triggers are set up externally)
   */
  setActiveSection: (sectionId: string | null) => void
  /**
   * Register a section element ref by ID
   * @example ref={registerSectionRef("section-1")}
   */
  registerSectionRef: (sectionId: string) => (node: HTMLElement | null) => void
  /**
   * Access to the section refs map
   */
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  /**
   * Manually setup triggers (call this after refs are registered if autoSetup is false)
   */
  setupTriggers: (containerAnim?: gsap.core.Tween) => void
}

function getDefaultPositions(direction: ScrollDirection) {
  return {
    start: direction === "vertical" ? "top center" : "left center",
    end: direction === "vertical" ? "bottom center" : "right center",
  }
}

/**
 * Hook for tracking which section is currently active during scroll.
 * Works with both vertical and horizontal scroll scenarios.
 *
 * @example
 * // Vertical scroll (automatic setup)
 * const { activeSection, registerSectionRef, scope } = useSectionTracker({
 *   direction: "vertical",
 * })
 *
 * @example
 * // Horizontal scroll with containerAnimation
 * const { activeSection, registerSectionRef, setupTriggers } = useSectionTracker({
 *   direction: "horizontal",
 *   autoSetup: false, // We'll call setupTriggers manually after creating containerAnimation
 * })
 *
 * useGSAP(() => {
 *   const containerAnimation = gsap.to(...)
 *   setupTriggers(containerAnimation)
 * })
 *
 * @example
 * // With external state management
 * const [activeSection, setActiveSection] = useState<string | null>(null)
 * const { registerSectionRef } = useSectionTracker({
 *   onSectionChange: setActiveSection,
 * })
 */
export function useSectionTracker(options: UseSectionTrackerOptions = {}): UseSectionTrackerReturn {
  const { onSectionChange, direction = "vertical", containerAnimation, start, end, autoSetup = true, scope } = options

  const [activeSection, setActiveSectionState] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const triggersRef = useRef<ScrollTriggerType[]>([])

  // Wrapper that calls both internal state and external callback
  const setActiveSection = useCallback(
    (sectionId: string | null) => {
      setActiveSectionState(sectionId)
      if (sectionId) {
        onSectionChange?.(sectionId)
      }
    },
    [onSectionChange]
  )

  const registerSectionRef = useCallback(
    (sectionId: string) => (node: HTMLElement | null) => {
      sectionRefs.current[sectionId] = node
    },
    []
  )

  // Manual trigger setup function
  const setupTriggers = useCallback(
    (containerAnim?: gsap.core.Tween) => {
      // Clean up existing triggers
      triggersRef.current.forEach((trigger) => trigger.kill())
      triggersRef.current = []

      gsap.registerPlugin(ScrollTrigger)

      const defaults = getDefaultPositions(direction)
      const triggerStart = start ?? defaults.start
      const triggerEnd = end ?? defaults.end

      Object.entries(sectionRefs.current).forEach(([sectionId, element]) => {
        if (!element) return

        const config: ScrollTrigger.Vars = {
          trigger: element,
          start: triggerStart,
          end: triggerEnd,
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        }

        // Add containerAnimation for horizontal scroll
        if (direction === "horizontal" && containerAnim) {
          config.containerAnimation = containerAnim
        }

        const trigger = ScrollTrigger.create(config)
        triggersRef.current.push(trigger)
      })
    },
    [direction, start, end, setActiveSection]
  )

  // Auto setup for vertical scroll when using useGSAP scope
  useGSAP(
    () => {
      if (!autoSetup || direction !== "vertical") return

      gsap.registerPlugin(ScrollTrigger)

      const defaults = getDefaultPositions(direction)
      const triggerStart = start ?? defaults.start
      const triggerEnd = end ?? defaults.end

      Object.entries(sectionRefs.current).forEach(([sectionId, element]) => {
        if (!element) return

        ScrollTrigger.create({
          trigger: element,
          start: triggerStart,
          end: triggerEnd,
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        })
      })
    },
    {
      scope: scope ?? undefined,
      dependencies: [autoSetup, direction, start, end, setActiveSection],
      revertOnUpdate: true,
    }
  )

  // Auto setup for horizontal scroll when containerAnimation is provided
  useEffect(() => {
    if (!autoSetup || direction !== "horizontal" || !containerAnimation) return

    setupTriggers(containerAnimation)

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill())
      triggersRef.current = []
    }
  }, [autoSetup, direction, containerAnimation, setupTriggers])

  return {
    activeSection,
    setActiveSection,
    registerSectionRef,
    sectionRefs,
    setupTriggers,
  }
}
