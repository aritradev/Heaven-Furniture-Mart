'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './Testimonials.module.css';

function StarRating({ count = 5, t }) {
  return (
    <div className={styles.stars} aria-label={t('stars', { count })}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={styles.star} aria-hidden="true">★</span>
      ))}
    </div>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <div className={styles.avatar} aria-hidden="true">
      {initials}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const founder = t.raw('founder');
  const testimonials = t.raw('items');

  return (
    <section
      className={`section section-dark ${styles.testimonials}`}
      id="testimonials"
      aria-label={t('ariaLabel')}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="micro-label">{t('microLabel')}</span>
          <h2 className={styles.headerTitle}>
            {t('title1')}
            <br />
            <em>{t('title2')}</em>
          </h2>
          <div className="gold-divider" style={{ margin: '20px auto 0' }} />
        </motion.div>

        {/* Founder Quote */}
        <motion.div
          className={styles.founderQuote}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.founderMark} aria-hidden="true">&quot;</span>
          <blockquote className={styles.founderText}>
            {founder.quote}
          </blockquote>
          <div className={styles.founderAttrib}>
            <span className={styles.founderName}>{founder.name}</span>
            <span className={styles.founderCompany}>{founder.company}</span>
          </div>
        </motion.div>

        {/* Customer Cards */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              className={styles.card}
              variants={cardVariants}
            >
              <StarRating count={5} t={t} />

              <blockquote className={styles.quote}>
                &quot;{item.quote}&quot;
              </blockquote>

              <div className={styles.itemTag}>{item.item}</div>

              <div className={styles.client}>
                <Avatar name={item.name} />
                <div className={styles.clientInfo}>
                  <span className={styles.clientName}>{item.name}</span>
                  <span className={styles.clientLocation}>{item.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className={styles.bottomCta}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.bottomCtaText}>
            {t('bottomCta')}
          </p>
          <a
            href="https://wa.me/8801960481983?text=Hi%2C%20I'd%20like%20to%20discuss%20custom%20furniture%20for%20my%20home"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {t('startJourney')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
