'use client';

import { motion } from 'framer-motion';
import styles from './ShowroomSection.module.css';

const WHATSAPP_HREF =
  "https://wa.me/8801960481983?text=Hi%2C%20I'd%20like%20to%20book%20a%20free%20design%20consultation";

const HOURS = [
  { days: 'Saturday – Thursday', time: '10:00 AM – 8:00 PM' },
  { days: 'Friday', time: '2:00 PM – 8:00 PM' },
];

const CONTACT_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.75 1.18 2 2 0 012.73 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/>
      </svg>
    ),
    label: 'Call',
    value: '+880 1960-481983',
    href: 'tel:+8801960481983',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'heavenfurnituremart@gmail.com',
    href: 'mailto:heavenfurnituremart@gmail.com',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Showroom — open in Maps',
    value: 'Agrabad Access Road, Chattogram',
    href: 'https://maps.google.com/?q=22.3296222,91.7930853',
  },
];

export default function ShowroomSection() {
  return (
    <section className={styles.showroom} id="visit" aria-labelledby="visit-heading">
      <div className={styles.inner}>

        {/* ── Single header: one ask, one headline ── */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="micro-label">Visit &amp; Enquire</span>
          <h2 id="visit-heading" className={styles.title}>
            Ready When<br />
            <em>You Are</em>
          </h2>
          <div className="gold-divider" style={{ margin: '20px auto 24px' }} />
          <p className={styles.lede}>
            Book a free design consultation, visit our Agrabad showroom, or
            simply WhatsApp us — we&apos;d love to hear your vision.
          </p>
        </motion.header>

        {/* ── Map + calling card ── */}
        <div className={styles.layout}>
          <motion.div
            className={styles.mapCol}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.mapFrame}>
              <iframe
                title="Heaven Furniture Mart — Agrabad Showroom Location"
                src="https://maps.google.com/maps?q=22.3296222,91.7930853+(Heaven+Furniture+Mart)&output=embed&z=16&hl=en"
                loading="lazy"
                className={styles.mapIframe}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={styles.mapScrim} aria-hidden="true" />
              <div className={styles.mapEdge} aria-hidden="true" />
            </div>
          </motion.div>

          <motion.aside
            className={styles.card}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hours — printed ledger */}
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Opening Hours</h3>
              <dl className={styles.hours}>
                {HOURS.map((h) => (
                  <div key={h.days} className={styles.hoursRow}>
                    <dt className={styles.hoursDay}>{h.days}</dt>
                    <dd className={styles.hoursTime}>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.rule} aria-hidden="true" />

            {/* Contact — each detail stated exactly once */}
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Reach Us</h3>
              <ul className={styles.contactList}>
                {CONTACT_ITEMS.map((item) => {
                  const external = item.href.startsWith('http');
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className={styles.contactItem}
                      >
                        <span className={styles.contactIcon} aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className={styles.contactText}>
                          <span className={styles.contactLabel}>{item.label}</span>
                          <span className={styles.contactValue}>{item.value}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Two ways in — neither repeats a detail listed above */}
            <div className={styles.actions}>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${styles.actionPrimary}`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Book a Free Consultation
              </a>
              <a href="tel:+8801960481983" className={`btn ${styles.actionSecondary}`}>
                Call the Showroom
              </a>
              <p className={styles.actionsNote}>
                No charge, no obligation — we&apos;ll talk through your space first.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
