'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './BrandAndJourney.module.css';

// ── Milestones (Our Journey) ──────────────────────────────────
const MILESTONES = [
  {
    year: '2020',
    title: 'Founded in Chattogram',
    desc: 'Heaven Furniture Mart was established by Managing Director Abul Kalam Bhuiyan with a commitment to bespoke luxury.',
  },
  {
    year: '2021',
    title: 'Agrabad Flagship Showroom',
    desc: "Opened our premier showroom on Agrabad Access Road — now one of Chattogram's largest custom furniture galleries.",
  },
  {
    year: '2024',
    title: 'International Furniture Fair',
    desc: 'Exhibited at the International Furniture Fair, showcasing hand-carved teak artistry to nationwide acclaim.',
  },
  {
    year: '2026',
    title: 'National & Industry Recognition',
    desc: 'Recognized by Bangladesh Furniture Industries Owners Association (BFIOA) and Chattogram Chamber of Commerce.',
  },
];

export default function BrandAndJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 30%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      className={styles.section}
      id="about"
      ref={containerRef}
      aria-label="About Heaven Furniture Mart & Our Journey"
    >
      <div className="container">
        {/* Header Label */}
        <div className={styles.topHeader}>
          <span className="micro-label">ABOUT HEAVEN FURNITURE</span>
          <h2 className={styles.mainTitle}>Crafting Comfort &amp; Elevating Spaces</h2>
          <div className="gold-divider" style={{ margin: '16px auto 0' }} />
        </div>

        {/* Split Screen Grid: Left = Milestones, Right = Brand Intro & Quote */}
        <div className={styles.splitGrid}>
          
          {/* ── LEFT COLUMN: Milestones / Our Journey ── */}
          <div className={styles.leftCol}>
            <div className={styles.colHeader}>
              <span className={styles.subTag}>OUR JOURNEY</span>
              <h3 className={styles.colTitle}>A Legacy of Excellence</h3>
            </div>

            <div className={styles.track}>
              <div className={styles.lineTrack}>
                <motion.div className={styles.lineFill} style={{ height: lineHeight }} />
              </div>
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  className={styles.item}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.dot} />
                  <div className={styles.card}>
                    <span className={styles.year}>{m.year}</span>
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
                <span className={styles.subTag}>FOUNDER&apos;S VISION</span>
                <h3 className={styles.colTitle}>Bespoke Furniture, Crafted Around You</h3>
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
                  &quot;At Heaven Furniture Mart, we believe furniture is more than just
                  function; it is a reflection of lifestyle, taste, and comfort.
                  Every piece we create is designed to bring lasting elegance into
                  the homes of our clients.&quot;
                </p>
                <div className={styles.attribution}>
                  <span className={styles.name}>Abul Kalam Bhuiyan</span>
                  <span className={styles.role}>Managing Director &amp; Founder</span>
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
                Founded in 2020, Heaven Furniture Mart has grown to become one of
                Chattogram&apos;s premier bespoke furniture studios. From our large
                showroom on Agrabad Access Road, we design and craft custom
                furniture — sofas, beds, dining sets, office pieces — built around
                what you actually want, not pulled off a shelf.
              </motion.p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
