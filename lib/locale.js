export const LOCALES = ['en', 'bn'];
export const DEFAULT_LOCALE = 'en';
export const LOCALE_COOKIE = 'HFM_LOCALE';

export function isValidLocale(value) {
  return LOCALES.includes(value);
}

export function resolveLocale(value) {
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}
