import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

// Feature flag - set to false to re-enable English locale detection
const FORCE_TURKISH_LOCALE = true

const SUPPORTED_LOCALES = ["tr", "en"] as const
const LOCALE_COOKIE = "LOCALE"

type Geo = {
  country?: string
}

export default function middleware(req: NextRequest) {
  const { nextUrl } = req
  const geo = (req as NextRequest & { geo?: Geo }).geo

  // Current requested path
  const path = nextUrl.pathname
  const localeInPath = path.split("/")[1]

  // If forcing Turkish locale, redirect all requests to Turkish
  if (FORCE_TURKISH_LOCALE) {
    // If user is trying to access /en/*, redirect to /tr/*
    if (localeInPath === "en") {
      const newPath = path.replace("/en", "/tr")
      return NextResponse.redirect(new URL(`${newPath}${nextUrl.search}`, req.url))
    }

    // If no locale in path, redirect to /tr
    if (!SUPPORTED_LOCALES.includes(localeInPath as (typeof SUPPORTED_LOCALES)[number])) {
      return NextResponse.redirect(new URL(`/tr${path}${nextUrl.search}`, req.url))
    }

    // If already on /tr/*, proceed normally
    if (localeInPath === "tr") {
      return intlMiddleware(req)
    }
  }

  // Original locale detection logic (used when FORCE_TURKISH_LOCALE is false)
  // If URL already contains a locale
  const hasLocaleInPath = SUPPORTED_LOCALES.includes(localeInPath as (typeof SUPPORTED_LOCALES)[number])

  // 1) When user visits `/tr/...` or `/en/...`,
  //    store that locale in a cookie for future visits.
  if (hasLocaleInPath) {
    const res = intlMiddleware(req)

    // Save locale in cookie
    const userPref = req.cookies.get(LOCALE_COOKIE)?.value
    if (userPref !== localeInPath) {
      res.cookies.set(LOCALE_COOKIE, localeInPath, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      })
    }

    return res
  }

  // 2) No locale in URL → detect locale preference
  // Priority: Cookie > Geo > Default

  // Geo detection - default to "tr" (Turkish) unless explicitly from an English-speaking country
  const country = geo?.country?.toUpperCase()
  const detectedLocale = country === "TR" || !country ? "tr" : "en"

  // Check if cookie exists
  const userPref = req.cookies.get(LOCALE_COOKIE)?.value
  const userHasPreference = SUPPORTED_LOCALES.includes(userPref as (typeof SUPPORTED_LOCALES)[number])

  // Use cookie if it exists, otherwise fall back to geo detection
  const finalLocale = userHasPreference ? userPref : detectedLocale

  return NextResponse.redirect(new URL(`/${finalLocale}${path}${nextUrl.search}`, req.url))
}

export const config = {
  matcher: ["/", "/(tr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
}
