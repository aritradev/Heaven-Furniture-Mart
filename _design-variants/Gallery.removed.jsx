'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { images } from '@/lib/images';
import styles from './Gallery.module.css';

const GALLERY_ITEMS = [
  { src: images.emeraldBed, alt: 'Emerald green velvet bed' },
  { src: images.creamShowcase, alt: 'Cream and gold glass showcase' },
  { src: images.modularSofa, alt: 'Minimalist modular sectional sofa' },
  { src: images.marbleDining, alt: 'Marble dining table with leather chairs' },
  { src: images.goldChair, alt: 'Royal gold carved dining chair' },
  { src: images.navyBed, alt: 'Royal navy and gold velvet bed' },
  { src: images.shoeCabinet, alt: 'Minimalist black and gold shoe cabinet' },
  { src: images.creamDining, alt: 'Cream marble dining table set' },
];

export default function Gallery() {
  return (
    <section className={`section ${styles.gallery}`} id="gallery">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={styles.header}
        >
          <span className="micro-label">Showcase</span>
          <h2>Crafted with Passion</h2>
          <p className={styles.headerSub}>
            A glimpse into our finest creations — each piece tells a story of
            skilled artisanship and uncompromising quality.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.alt}
              className={styles.item}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={styles.image}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
