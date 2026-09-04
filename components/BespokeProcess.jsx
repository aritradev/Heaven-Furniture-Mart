'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { images } from '@/lib/images';
import LoopingVideo from './LoopingVideo';
import styles from './BespokeProcess.module.css';

// ── Process Steps ─────────────────────────────────────────────
const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Free Consultation',
    desc: 'WhatsApp or visit our showroom. Tell us your space, style, and budget. Zero commitment.',
    timeframe: '1–2 days',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Design & Approval',
    desc: 'Our designers sketch your piece — dimensions, materials, finishes. You approve before a single cut.',
    timeframe: '2–4 days',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Handcrafted',
    desc: 'Built by our in-house artisans using solid Chittagong teak, premium velvets, and genuine leathers.',
    timeframe: '2–4 weeks',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Delivered & Installed',
    desc: "White-glove delivery to your door. Professional assembly included. We don't leave until it's perfect.",
    timeframe: 'Same day',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

// ── Trust Bullets ─────────────────────────────────────────────
const TRUST_POINTS = [
  { icon: '✦', text: 'Free design consultation — no obligations' },
  { icon: '✦', text: 'Every piece custom-built to your exact space' },
  { icon: '✦', text: 'Solid wood frames, premium fabrics & leathers' },
  { icon: '✦', text: 'In-house artisans — never outsourced' },
  { icon: '✦', text: 'White-glove delivery & professional installation' },
  { icon: '✦', text: 'Flexible payment plans for every budget' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function BespokeProcess() {
  return (
    <section
      className={styles.section}
      id="bespoke-process"
      aria-label="Bespoke Furniture and How It Works"
    >

      {/* ── BLOCK 1: Hero Message ─────────────────────────── */}
      <div className={styles.heroBlock}>
        <div className={`container ${styles.heroInner}`}>
          {/* Image column */}
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.imageMain}>
              <Image
                src={images.blueSofaPair}
                alt="Bespoke royal blue velvet sofa pair — Heaven Furniture Mart"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.img}
                placeholder="blur"
              />
            </div>
            {/* The inset frame is a silent loop of the piece being made —
                the finished object on the left, the hands behind it on
                the right. It carries no still: the video is the content. */}
            <div className={styles.imageAccent}>
              <LoopingVideo src="/craft.mp4" className={styles.img} />
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            className={styles.textCol}
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="micro-label">The Heaven Difference</span>
            <h2 className={styles.heroTitle}>
              Your Vision.<br />
              <em>Our Craft.</em>
            </h2>
            <p className={styles.heroDesc}>
              Every piece of Heaven furniture starts with a conversation — your
              space, your style, your life. We don&apos;t sell from a catalog.
              We build around you. From concept to installation, furniture
              that&apos;s truly, uniquely yours.
            </p>

            {/* Trust bullets — 2-col compact grid */}
            <motion.ul
              className={styles.trustGrid}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {TRUST_POINTS.map((p) => (
                <motion.li key={p.text} className={styles.trustItem} variants={fadeUp}>
                  <span className={styles.trustIcon}>{p.icon}</span>
                  <span>{p.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className={styles.heroCtas}>
              <a
                href="https://wa.me/8801960481983?text=Hi%2C%20I'm%20interested%20in%20a%20bespoke%20furniture%20consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Schedule Free Consultation
              </a>
              <a
                href="https://wa.me/8801960481983?text=Hi%2C%20I'd%20like%20a%20free%20room%20styling%20preview%20for%20my%20home"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ghostBtn}
              >
                ✦ Request a Room Preview
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BLOCK 2: Process Steps ────────────────────────── */}
      <div className={styles.processBlock}>
        <div className="container">
          <motion.div
            className={styles.processHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="micro-label">The Process</span>
            <h2 className={styles.processTitle}>From Vision to Reality</h2>
            <p className={styles.processSub}>
              Four steps — designed to make ordering bespoke furniture completely effortless.
            </p>
          </motion.div>

          <motion.div
            className={styles.stepsGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={step.number} className={styles.stepCard} variants={fadeUp}>
                <div className={styles.stepNumBadge}>{step.number}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDesc}>{step.desc}</p>
                <div className={styles.stepTime}>⏱ Est. {step.timeframe}</div>
                {i < PROCESS_STEPS.length - 1 && (
                  <span className={styles.stepArrow} aria-hidden="true">→</span>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Inline WhatsApp nudge */}
          <motion.div
            className={styles.processNudge}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span>Questions? We reply within minutes.</span>
            <a
              href="https://wa.me/8801960481983?text=Hi%2C%20I%20have%20a%20question%20about%20ordering%20custom%20furniture"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Ask on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
