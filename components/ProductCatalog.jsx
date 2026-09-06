'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CATEGORIES, resolveProducts } from '@/lib/products';
import RoomPreview from './RoomPreview';
import styles from './ProductCatalog.module.css';

export default function ProductCatalog({
  activeFilter = 'all',
  onSelectCategory,
}) {
  const t = useTranslations('catalog');
  const [selectedCategory, setSelectedCategory] = useState(activeFilter);
  const [quickViewId, setQuickViewId] = useState(null);
  const [roomPreviewId, setRoomPreviewId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Smooth Elevation & Focus State
  const [activeCardId, setActiveCardId] = useState(null);
  const [focusedCardId, setFocusedCardId] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!quickViewId) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewId]);

  const currentCategory = onSelectCategory ? activeFilter : selectedCategory;

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    if (onSelectCategory) {
      onSelectCategory(key);
    }
  };

  const products = resolveProducts(t);
  const filteredProducts = products.filter((prod) =>
    currentCategory === 'all' ? true : prod.category === currentCategory
  );

  // Derive the open modals from the freshly translated list rather than holding a
  // captured product object — otherwise switching language leaves an open modal
  // showing copy from the previous locale.
  const quickViewItem = quickViewId
    ? products.find((prod) => prod.id === quickViewId) ?? null
    : null;
  const roomPreviewItem = roomPreviewId
    ? products.find((prod) => prod.id === roomPreviewId) ?? null
    : null;

  const getWhatsAppLink = (item) => {
    const msg = encodeURIComponent(
      t('whatsapp.template', { product: item.title, price: item.price })
    );
    return `https://wa.me/8801960481983?text=${msg}`;
  };

  // Mouse Enter: Set active card & start 0.2s elevation timer
  const handleMouseEnter = (cardId) => {
    setActiveCardId(cardId);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setFocusedCardId(cardId);
    }, 200);
  };

  // Mouse Leave: Clear timers & smoothly reset card elevation
  const handleMouseLeave = (cardId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (activeCardId === cardId) setActiveCardId(null);
    if (focusedCardId === cardId) setFocusedCardId(null);
  };

  return (
    <section className={styles.catalogSection} id="catalog">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="micro-label">{t('microLabel')}</span>
          <h2 className={styles.headerTitle}>{t('sectionHeader')}</h2>
          <div className="gold-divider" style={{ margin: '16px auto 24px' }} />
          <p className={styles.headerSub}>{t('headerSub')}</p>

          {/* Filter Tabs */}
          <div className={styles.filterBar}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.filterBtn} ${currentCategory === cat.key ? styles.activeFilter : ''}`}
                onClick={() => handleCategoryChange(cat.key)}
              >
                {t(`categories.${cat.key}`)}
              </button>
            ))}
          </div>

          {/* Guarantee / Trust bar */}
          <div className={styles.trustBar}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🚚</span>
              <span>{t('trustBar.delivery')}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🛡️</span>
              <span>{t('trustBar.warranty')}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔄</span>
              <span>{t('trustBar.exchange')}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>💳</span>
              <span>{t('trustBar.emi')}</span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {filteredProducts.map((item) => {
              const isHovered = activeCardId === item.id;
              const isFocused = focusedCardId === item.id;
              const isDimmed = activeCardId !== null && !isHovered;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  key={item.id}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={() => handleMouseLeave(item.id)}
                  className={`${styles.productCard} ${isHovered ? styles.cardHovered : ''} ${isDimmed ? styles.cardDimmed : ''} ${isFocused ? styles.cardElevated : ''}`}
                >
                  {/* Image Wrap */}
                  <div
                    className={`${styles.imageContainer} ${isFocused ? styles.brassSpotlight : ''}`}
                    style={{ '--card-bg': item.bgColor || '#e4e5caff' }}
                  >
                    <Image
                      src={item.image}
                      alt={`Heaven Furniture Mart — ${item.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.productImage}
                    />
                    <span className={styles.categoryBadge}>{item.categoryLabel}</span>
                    <span className={styles.priceTag}>{item.price}</span>
                  </div>

                  {/* Content */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.productTitle}>{item.title}</h3>
                    {item.hook && <p className={styles.productHook}>&quot;{item.hook}&quot;</p>}

                    {item.dimensions && (
                      <div className={styles.dimensionsBadge}>
                        <span className={styles.dimLabel}>{t('dimsLabel')}</span> {item.dimensions}
                      </div>
                    )}

                    <ul className={styles.specList}>
                      {item.specs.map((spec, i) => (
                        <li key={i}>
                          <span className={styles.specDot}>✓</span> {spec}
                        </li>
                      ))}
                    </ul>

                    {item.dailyMath && (
                      <div className={styles.dailyMathTag}>
                        <span className={styles.mathIcon}>💡</span> {item.dailyMath}
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      <button
                        onClick={() => setQuickViewId(item.id)}
                        className={styles.quickViewBtn}
                      >
                        {t('quickView')}
                      </button>

                      <button
                        onClick={() => setRoomPreviewId(item.id)}
                        className={styles.roomPreviewBtn}
                      >
                        <RoomIcon />
                        {t('seeInMyRoom')}
                      </button>

                      <a
                        href={getWhatsAppLink(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.orderWhatsappBtn}
                      >
                        {t('orderWhatsApp')}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Quick View Modal */}
        {quickViewItem && mounted && createPortal(
          <div className={styles.modalBackdrop} onClick={() => setQuickViewId(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setQuickViewId(null)}
              >
                ✕
              </button>

              <div className={styles.modalGrid}>
                <div
                  className={styles.modalImageWrap}
                  style={{ '--card-bg': quickViewItem.bgColor || '#b0030e' }}
                >
                  <Image
                    src={quickViewItem.image}
                    alt={quickViewItem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 430px"
                    className={styles.modalImage}
                    placeholder="blur"
                    priority
                  />
                </div>

                <div className={styles.modalInfo}>
                  <span className={styles.modalBadge}>{quickViewItem.categoryLabel}</span>
                  <h3 className={styles.modalTitle}>{quickViewItem.title}</h3>
                  {quickViewItem.hook && <p className={styles.modalHook}>&quot;{quickViewItem.hook}&quot;</p>}
                  <span className={styles.modalPrice}>{quickViewItem.price}</span>

                  {quickViewItem.dailyMath && (
                    <div className={styles.modalDailyMath}>
                      💡 <strong>{t('modal.investment')}</strong> {quickViewItem.dailyMath}
                    </div>
                  )}

                  <p className={styles.modalDesc}>{quickViewItem.description}</p>

                  {quickViewItem.dimensions && (
                    <div className={styles.modalDimensions}>
                      📐 <strong>{t('modal.dimensions')}</strong> {quickViewItem.dimensions}
                    </div>
                  )}

                  <div className={styles.modalSpecsGroup}>
                    <h4>{t('modal.craftsmanship')}</h4>
                    <ul>
                      {quickViewItem.specs.map((spec, i) => (
                        <li key={i}>✓ {spec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.replyGuaranteeNote}>
                    ⚡ <em>{t('modal.replyNote')}</em>
                  </div>

                  <div className={styles.modalCtaRow}>
                    <button
                      className={styles.modalSecondaryBtn}
                      onClick={() => {
                        setRoomPreviewId(quickViewId);
                        setQuickViewId(null);
                      }}
                    >
                      <RoomIcon />
                      {t('modal.seeInRoom')}
                    </button>

                    <a
                      href={getWhatsAppLink(quickViewItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalPrimaryBtn}
                    >
                      {t('modal.reserve')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Room Preview */}
        {roomPreviewItem && mounted && createPortal(
          <RoomPreview
            item={roomPreviewItem}
            onClose={() => setRoomPreviewId(null)}
          />,
          document.body
        )}
      </div>
    </section>
  );
}

const RoomIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 10v11h14V10" />
    <path d="M3 17h18" />
  </svg>
);
