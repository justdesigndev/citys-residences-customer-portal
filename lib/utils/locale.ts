import { cookies } from "next/headers"
import { routing } from "@/i18n/routing"

// Use locales from routing configuration to keep in sync
const SUPPORTED_LOCALES = routing.locales
const LOCALE_COOKIE = "LOCALE"

export type SupportedLocale = (typeof routing.locales)[number]

/**
 * Server-side helper to get the active locale from cookies
 * Falls back to the default locale if no cookie is found
 */
export async function getActiveLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value

  if (localeCookie && (SUPPORTED_LOCALES as readonly string[]).includes(localeCookie)) {
    return localeCookie as SupportedLocale
  }

  return routing.defaultLocale as SupportedLocale
}

/**
 * Get the locale cookie name (for reference)
 */
export function getLocaleCookieName(): string {
  return LOCALE_COOKIE
}
