/* eslint-disable @next/next/no-img-element */
"use client"

import { useLocale } from "next-intl"
import { useMemo, useRef } from "react"

import { AutoplayVideo } from "@/components/autoplay-video"
import { gsap, ScrollTrigger, useGSAP } from "@/components/gsap"
import { Link } from "@/i18n/navigation"
import type { Locale, Pathnames } from "@/i18n/routing"
import { routeConfig } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const pinRef = useRef<HTMLDivElement | null>(null)
  const locale = useLocale()

  const navbarSections = useMemo(
    () =>
      Object.values(routeConfig)
        .filter((item) => item.inNavbar)
        .sort((a, b) => a.order - b.order),
    []
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      gsap.registerPlugin(ScrollTrigger)

      console.log(pin.scrollWidth, document.documentElement.clientWidth)

      const containerAnimation = gsap.to(pin, {
        x: () => -(pin.scrollWidth - document.documentElement.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + (pin.scrollWidth - window.innerWidth),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      pin.querySelectorAll<HTMLElement>("[data-slide]").forEach((slide) => {
        ScrollTrigger.create({
          trigger: slide,
          start: "left center",
          end: "right center",
          containerAnimation,
          toggleClass: { targets: slide, className: "active" },
        })
      })
    },
    { scope: sectionRef, dependencies: [navbarSections.length], revertOnUpdate: true }
  )

  return (
    <div>
      <section ref={sectionRef} className='relative min-h-screen w-full overflow-hidden block xl:hidden'>
        <div ref={pinRef} className='flex h-screen w-max items-end pb-24' id='section_pin'>
          {navbarSections.map((item) => (
            <div key={item.id} data-slide className='w-screen shrink-0 px-6'>
              <div className='flex w-full items-center justify-center'>
                <Link
                  href={item.paths[locale as Locale] as Pathnames}
                  locale={locale as Locale}
                  className='w-full aspect-16/12'
                >
                  <AutoplayVideo playbackId={item.media?.muxSrc} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
