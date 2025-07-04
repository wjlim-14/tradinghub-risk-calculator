// Client-side dictionary imports
import enDict from '../dictionaries/en.json'
import cnDict from '../dictionaries/cn.json'

const dictionaries = {
  en: enDict,
  cn: cnDict,
}

export const getDictionary = (locale: 'en' | 'cn') =>
  dictionaries[locale] || dictionaries.en

export type Locale = 'en' | 'cn'

export const locales: Locale[] = ['en', 'cn']

export const defaultLocale: Locale = 'en'