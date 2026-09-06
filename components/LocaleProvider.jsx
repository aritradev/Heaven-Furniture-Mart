'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import enMessages from '@/messages/en.json';
import bnMessages from '@/messages/bn.json';
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from '@/lib/locale';

const MESSAGES = { en: enMessages, bn: bnMessages };

const LocaleContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

function readStoredLocale() {
  try {
    const stored = window.localStorage.getItem(LOCALE_COOKIE);
    if (stored && LOCALES.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be blocked (private mode, cookies disabled) — ignore.
  }

  return null;
}

export function LocaleProvider({ children }) {
  // Start at the default so the first client render matches the statically
  // prerendered HTML; a stored choice is adopted right after mount. Reading
  // localStorage during useState would render Bengali against English server
  // HTML and throw away the whole document on hydration.
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => {
    const setLocale = (next) => {
      if (!LOCALES.includes(next)) return;
      setLocaleState(next);
      try {
        window.localStorage.setItem(LOCALE_COOKIE, next);
      } catch {
        // Persisting the choice is best-effort — ignore failures.
      }
    };
    return { locale, setLocale };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone="Asia/Dhaka"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
