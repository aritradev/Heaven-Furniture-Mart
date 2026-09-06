'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import HeroVideo from './HeroVideo';
import styles from './HeroScene.module.css';

/* ─── Stats skeleton: numbers/suffixes are visual, labels from messages.hero.stats ─── */
const STATS_VALUES = [
  { value: 1500, suffix: '+' },
  { value: 6, suffix: '+' },
  { value: 500, suffix: '+' },
  { value: 1, suffix: '' },
];

function CountUp({ target, suffix, duration = 1600 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    // Someone who has asked for less motion gets the figure, not the tally.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Hero Section ─── */
export default function HeroScene() {
  const t = useTranslations('hero');
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-20px' });

  // Merge each stat's label from messages; keep numbers as-is.
  const statsLabels = Object.values(t.raw('stats'));
  const stats = STATS_VALUES.map((s, i) => ({ ...s, label: statsLabels[i] }));

  return (
    <section className={styles.hero} id="hero">
      <HeroVideo />

      <div className={styles.overlay}>
        <div className={styles.content}>
          {/* A rule on either side of the label, rather than the usual
              letterspaced caps floating on their own. The rules are what make
              it read as a mark on the work instead of a heading above it. */}
          <span className={styles.eyebrow}>
            <i className={styles.eyebrowRule} />
            {t('eyebrow')}
            <i className={styles.eyebrowRule} />
          </span>

          <h1 className={styles.title}>
            {t('titleLine1')}
            <br />
            <em>{t('titleLine2')}</em>
          </h1>

          <p className={styles.subtitle}>
            {t('subtitle')}
          </p>

          <div className={styles.ctas}>
            <a href="#catalog" className="btn btn-primary">
              {t('ctaExplore')}
            </a>
            <a
              href="https://wa.me/8801960481983?text=Hi%2C%20I'm%20interested%20in%20a%20free%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('ctaWhatsApp')}
            </a>
          </div>

          {/* A hairline row, not a frosted card. The card competed with the
              headline for the eye; these are supporting evidence and should
              read that way. */}
          <div className={styles.stats} ref={statsRef}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.stat}
                initial={{ opacity: 0, y: 14 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.statNum}>
                  {statsInView ? <CountUp target={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                </span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* The footage is the shop, not a mood board — so the page says so. It
          also does the scroll indicator's job: a line across the base of the
          viewport that the eye follows down. */}
      <a
        href="#contact"
        className={styles.live}
        title={t('liveTitle')}
      >
        <span className={styles.liveDot} aria-hidden="true" />
        <span className={styles.liveText}>
          {t('liveText1')} <strong>{t('liveText2')}</strong>
        </span>
        <span className={styles.liveGo} aria-hidden="true">{t('liveVisit')}</span>
      </a>
    </section>
  );
}
