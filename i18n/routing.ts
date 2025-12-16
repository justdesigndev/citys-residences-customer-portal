import { pathnames } from "@/lib/constants"
import { defineRouting } from "next-intl/routing"

// Feature flag: Set to true to enable English locale
const ENABLE_ENGLISH_LOCALE = false

export const routing = defineRouting({
  locales: ENABLE_ENGLISH_LOCALE ? ["tr", "en"] : ["tr"],
  defaultLocale: "tr",
  localePrefix: "never",
  pathnames: pathnames,
})

export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]
