'use client';

import { motion } from 'framer-motion';
import styles from './Testimonials.module.css';

const FOUNDER_QUOTE = {
  quote:
    "Heaven Furniture Mart was built on one belief: every home deserves furniture that tells its own story. We don't build for the masses — we build for you.",
  name: 'Founder & Managing Director',
  company: 'Heaven Furniture Mart, Chattogram',
};

const TESTIMONIALS = [
  {
    quote:
      'The custom sofa set they built for our living room is beyond anything we imagined. The team visited our home, understood our space perfectly, and delivered in 3 weeks. Absolute perfection.',
    name: 'Md. Tanvir Hossain',
    location: 'GEC Circle, Chattogram',
    rating: 5,
    item: 'Custom 5-Piece Sofa Set',
  },
  {
    quote:
      'I gave them a photo from Pinterest and they recreated it in solid teak — even better than the original. The craftsmanship on the headboard is extraordinary. Worth every taka.',
    name: 'Mrs. Nasreen Akter',
    location: 'Nasirabad, Chattogram',
    rating: 5,
    item: 'King Velvet Bed with Custom Headboard',
  },
  {
    quote:
      'We furnished our entire office — executive chairs, conference table, reception desk — all from Heaven. Professional service, on-time delivery, and the quality is unmatched in the city.',
    name: 'Md. Rafiqul Islam',
    location: 'Agrabad Commercial Area',
    rating: 5,
    item: 'Full Office Furnishing',
  },
  {
    quote:
      'The dining table they made for us is now the centerpiece of every family gathering. Genuine marble top, hand-carved legs — it looks like it belongs in a 5-star hotel.',
    name: 'Farida Begum',
    location: 'Halishahar, Chattogram',
    rating: 5,
    item: 'Marble Dining Table Set — 8 Seater',
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
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
  return (
    <section
      className={`section section-dark ${styles.testimonials}`}
      id="testimonials"
      aria-label="Customer Testimonials"
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
          <span className="micro-label">What Our Clients Say</span>
          <h2 className={styles.headerTitle}>
            Thousands of Happy
            <br />
            <em>Homeowners</em>
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
            {FOUNDER_QUOTE.quote}
          </blockquote>
          <div className={styles.founderAttrib}>
            <span className={styles.founderName}>{FOUNDER_QUOTE.name}</span>
            <span className={styles.founderCompany}>{FOUNDER_QUOTE.company}</span>
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
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              className={styles.card}
              variants={cardVariants}
            >
              <StarRating count={t.rating} />

              <blockquote className={styles.quote}>
                &quot;{t.quote}&quot;
              </blockquote>

              <div className={styles.itemTag}>{t.item}</div>

              <div className={styles.client}>
                <Avatar name={t.name} />
                <div className={styles.clientInfo}>
                  <span className={styles.clientName}>{t.name}</span>
                  <span className={styles.clientLocation}>{t.location}</span>
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
            Join hundreds of happy homeowners across Chattogram
          </p>
          <a
            href="https://wa.me/8801960481983?text=Hi%2C%20I'd%20like%20to%20discuss%20custom%20furniture%20for%20my%20home"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Start Your Journey →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
