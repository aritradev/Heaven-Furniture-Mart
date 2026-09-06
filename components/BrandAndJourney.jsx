'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './BrandAndJourney.module.css';

export default function BrandAndJourney() {
  const t = useTranslations('about');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 30%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Milestones live in messages as an object keyed by year.
  const milestones = Object.entries(t.raw('milestones'));

  return (
    <section
      className={styles.section}
      id="about"
      ref={containerRef}
      aria-label={t('ariaLabel')}
    >
      <div className="container">
        {/* Header Label */}
        <div className={styles.topHeader}>
          <span className="micro-label">{t('microLabel')}</span>
          <h2 className={styles.mainTitle}>{t('mainTitle')}</h2>
          <div className="gold-divider" style={{ margin: '16px auto 0' }} />
        </div>

        {/* Split Screen Grid: Left = Milestones, Right = Brand Intro & Quote */}
        <div className={styles.splitGrid}>

          {/* ── LEFT COLUMN: Milestones / Our Journey ── */}
          <div className={styles.leftCol}>
            <div className={styles.colHeader}>
              <span className={styles.subTag}>{t('journeyTag')}</span>
              <h3 className={styles.colTitle}>{t('journeyTitle')}</h3>
            </div>

            <div className={styles.track}>
              <div className={styles.lineTrack}>
                <motion.div className={styles.lineFill} style={{ height: lineHeight }} />
              </div>
              {milestones.map(([year, m], i) => (
                <motion.div
                  key={year}
                  className={styles.item}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.dot} />
                  <div className={styles.card}>
                    <span className={styles.year}>{year}</span>
                    <h4 className={styles.milestoneTitle}>{m.title}</h4>
                    <p className={styles.milestoneDesc}>{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Brand Intro & Founder Quote ── */}
          <div className={styles.rightCol}>
            <div className={styles.stickyContent}>
              <div className={styles.colHeader}>
                <span className={styles.subTag}>{t('visionTag')}</span>
                <h3 className={styles.colTitle}>{t('visionTitle')}</h3>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={styles.quoteBlock}
              >
                <div className="gold-divider" style={{ margin: '0 0 20px 0' }} />
                <p className={styles.quote}>
                  {t('quote')}
                </p>
                <div className={styles.attribution}>
                  <span className={styles.name}>{t('founderName')}</span>
                  <span className={styles.role}>{t('founderRole')}</span>
                </div>
                <div className="gold-divider" style={{ margin: '20px 0 0 0' }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={styles.introDesc}
              >
                {t('introDesc')}
              </motion.p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
