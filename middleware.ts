import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { locales, defaultLocale } from './src/lib/dictionaries'

// Always default to English for root domain access
function getLocale(request: NextRequest): string {
  // Always return 'en' as default locale for https://tradinghub-risk-calculator.vercel.app/
  return 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}