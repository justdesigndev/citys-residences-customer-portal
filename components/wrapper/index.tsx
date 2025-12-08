"use client"

import { useLocale } from "next-intl"

import { SmoothScroll } from "@/components/smooth-scroll"

interface CountryData {
  isoCode: string
  name: string
}

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean
  webgl?: boolean | object
  stickySidebar?: boolean
  headerWithNavigation?: boolean
  contactForm?: boolean
  footer?: boolean
  countries?: CountryData[]
}

export function Wrapper({
  children,
  lenis = true,
  className,
  stickySidebar = true,
  headerWithNavigation = true,
  footer = true,
  contactForm = true,
  countries = [],
  ...props
}: WrapperProps) {
  const locale = useLocale()

  return (
    <>
      <div>
        <main className={className} {...props}>
          {children}
        </main>
      </div>
      {lenis && <SmoothScroll root />}
    </>
  )
}
