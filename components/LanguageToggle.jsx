'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from './LocaleProvider';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle({ compact = false }) {
  const t = useTranslations('common');
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`${styles.switch} ${compact ? styles.compact : ''}`}
      role="group"
      aria-label={t('langLabel')}
    >
      <button
        type="button"
        className={`${styles.seg} ${locale === 'en' ? styles.active : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        {t('eng')}
      </button>
      <button
        type="button"
        className={`${styles.seg} ${locale === 'bn' ? styles.active : ''}`}
        onClick={() => setLocale('bn')}
        aria-pressed={locale === 'bn'}
      >
        {t('bn')}
      </button>
    </div>
  );
}
