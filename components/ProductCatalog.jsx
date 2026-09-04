'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { images } from '@/lib/images';
import RoomPreview from './RoomPreview';
import styles from './ProductCatalog.module.css';

export const CATALOG_PRODUCTS = [
  // Living Room
  {
    id: 'classic-sofa',
    title: 'Classic Cream Sofa Set',
    category: 'living',
    categoryLabel: 'Living Room',
    price: '৳185,000',
    bgColor: '#b0030e',
    hook: 'The drawing room centerpiece your guests will admire and remember.',
    description: 'Hand-sculpted by Chattogram artisans from seasoned Chittagong teak. Upholstered in treated cream velvet that repels dark tea, oil, and everyday spills without staining.',
    image: images.classicSofa,
    specs: [
      'Kiln-dried timber foundation featuring reinforced mortise-and-tenon joinery',
      'Spill-shield fabric — liquids bead up for instant wiping',
      'High-resilience cushion core maintains full shape over decades',
      'Complete 4-piece suite: 3-seater sofa, 2 matching armchairs, and center coffee table'
    ],
    dimensions: '3-Seater: 84"W × 34"D × 36"H | Armchairs: 38"W × 34"D × 36"H',
    dailyMath: '≈ ৳34/night over 15 years. Free delivery + in-home assembly included.',
  },
  {
    id: 'blue-sofa-pair',
    title: 'Royal Blue Velvet Pair',
    category: 'living',
    categoryLabel: 'Living Room',
    price: '৳145,000',
    bgColor: '#7b0d17',
    hook: 'Two statement armchairs that instantly elevate the tone of your living space.',
    description: 'Deep cobalt velvet framed by hand-applied gold leaf filigree. Designed as a conversation pair for formal lounges or master bedroom corners.',
    image: images.blueSofaPair,
    specs: [
      'Artisanal gilding over solid hardwood contours',
      'Tailored seat density — customized to your preferred firmness',
      'Plush upholstery built to withstand years of active hosting'
    ],
    dimensions: 'Armchairs: 36"W × 34"D × 38"H | Accent Table: 36" Dia',
    dailyMath: '≈ ৳26/night over 15 years.',
  },
  {
    id: 'modular-sofa',
    title: 'Modular Sectional Sofa',
    category: 'living',
    categoryLabel: 'Living Room',
    price: '৳195,000',
    bgColor: '#96111f',
    hook: 'Adaptable seating designed for fluid spaces and growing families.',
    description: 'Wrapped in neutral woven linen with movable chaise components. Easily reconfigures from an expansive L-corner into standalone seating modules.',
    image: images.modularSofa,
    specs: [
      'Reversible sectional layout to suit left or right room corners',
      'Stain-repellent textile weave engineered for easy spot cleaning',
      'Interlocking hidden connectors keep sections firmly anchored'
    ],
    dimensions: '110"W × 68"D (Chaise) × 32"H',
    dailyMath: '≈ ৳35/night over 15 years.',
  },
  {
    id: 'glass-showcase',
    title: 'Carved Glass Display Showcase',
    category: 'living',
    categoryLabel: 'Living Room',
    price: '৳88,000',
    bgColor: '#8a101a',
    hook: 'A lit gallery cabinet for heirloom china, awards, and cherished keepsakes.',
    description: 'Rich mahogany frame with integrated warm spotlights that illuminate every shelf. Features brass key locks to protect delicate valuables.',
    image: images.glassShowcase,
    specs: [
      'Built-in warm LED illumination creates ambient evening backlighting',
      'Heavy-gauge tempered glass shelves with high weight capacity',
      'Keyed locking doors secure collectibles against curious toddlers'
    ],
    dimensions: '42"W × 18"D × 78"H',
    dailyMath: '≈ ৳24/day over 10 years. Complete installation included.',
  },
  {
    id: 'shoe-cabinet',
    title: 'Minimalist Black & Gold Cabinet',
    category: 'living',
    categoryLabel: 'Living Room',
    price: '৳42,000',
    bgColor: '#901c26',
    hook: 'Organized entryway storage disguised as a sleek contemporary console.',
    description: 'Satin black timber accented with brushed brass pull handles. Features soft-closing doors that shut noiselessly every single time.',
    image: images.shoeCabinet,
    specs: [
      'Conceals up to 24 pairs of footwear across ventilated slatted shelves',
      'Architectural metal hardware with anti-tarnish coating',
      'German-engineered hinges prevent door slamming'
    ],
    dimensions: '36"W × 15"D × 42"H',
    dailyMath: '≈ ৳11/day over 10 years.',
  },

  // Bedroom
  {
    id: 'emerald-bed',
    title: 'Majesty Emerald Velvet Bed',
    category: 'bedroom',
    categoryLabel: 'Bedroom',
    price: '৳165,000',
    bgColor: '#69000b',
    hook: 'Deep jewel-toned upholstery crafted for luxurious, restful sleep.',
    description: 'Hand-tufted emerald green headboard framed in brass metallic trim. Supported by a noise-free steel slat system that eliminates squeaks.',
    image: images.emeraldBed,
    specs: [
      'Diamond-tufted backrest with polished gold-tone perimeter',
      'Heavy-duty steel foundation grid guarantees zero mattress sagging',
      'Generous King size proportions (6ft × 7ft) for optimal relaxation'
    ],
    dimensions: '78"W × 88"L × 56"H (King Size 6ft × 7ft)',
    dailyMath: '≈ ৳45/night over 10 years.',
  },
  {
    id: 'teal-bed',
    title: 'Luxury Teal Velvet Bed',
    category: 'bedroom',
    categoryLabel: 'Bedroom',
    price: '৳155,000',
    bgColor: '#870e19',
    hook: 'Seamless architectural design featuring built-in bedside nightstands.',
    description: 'Deep aqua upholstery with floating side drawers. Streamlines your bedroom suite into one unified purchase.',
    image: images.tealBed,
    specs: [
      'Integrated dual nightstands save floor space and matching effort',
      'Soft-touch plush fabric treated against dust accumulation',
      'Custom size options tailored to your layout'
    ],
    dimensions: '74"W × 86"L × 52"H',
    dailyMath: '≈ ৳42/night over 10 years.',
  },
  {
    id: 'navy-bed',
    title: 'Royal Navy & Gold Velvet Bed',
    category: 'bedroom',
    categoryLabel: 'Bedroom',
    price: '৳175,000',
    bgColor: '#7e0211',
    hook: 'Our master bedroom flagship, constructed with heirloom solid teak.',
    description: 'Deep midnight navy upholstery set within a carved teak frame and warm brass accents. Built to last for generations.',
    image: images.navyBed,
    specs: [
      'Moisture-resistant hardwood core engineered to withstand coastal humidity',
      'Hand-finished inlay along headboard and footboard borders',
      'High-backed ergonomic support ideal for reading in bed'
    ],
    dimensions: '80"W × 88"L × 58"H (King Size)',
    dailyMath: '≈ ৳48/night over 10 years. Includes white-glove setup.',
  },
  {
    id: 'white-bed',
    title: 'White Wooden Panel Bed',
    category: 'bedroom',
    categoryLabel: 'Bedroom',
    price: '৳125,000',
    bgColor: '#8d0713',
    hook: 'Clean Scandi aesthetic paired with spacious under-bed storage drawers.',
    description: 'Multi-layered satin white finish over a durable timber core. Conceals massive sliding under-bed drawers for extra linens and luggage.',
    image: images.whiteBed,
    specs: [
      'Dual under-bed drawers swallow extra bedding and seasonal wardrobe',
      'Durable protective enamel coating wipes clean easily with a soft cloth',
      'Minimalist headboard suitable for modern interiors'
    ],
    dimensions: '76"W × 86"L × 48"H',
    dailyMath: '≈ ৳34/night over 10 years.',
  },

  // Dining Room
  {
    id: 'marble-dining',
    title: 'Luxury Marble Dining Table Set',
    category: 'dining',
    categoryLabel: 'Dining Room',
    price: '৳210,000',
    bgColor: '#800f15',
    hook: 'Calacatta marble paired with Nappa leather for memorable family feasts.',
    description: 'Polished natural stone surface treated with a protective seal. Accompanied by 6 plush Nappa leather chairs for long dinner conversations.',
    image: images.marbleDining,
    specs: [
      'Sealed Calacatta slab resists hot serving dishes and dark spice oils',
      '6 ergonomic seats wrapped in supple leather upholstery',
      'Spacious 8-foot surface comfortably accommodates up to 8 guests'
    ],
    dimensions: '96"W × 42"D × 30"H (8-Seater 8ft)',
    dailyMath: '≈ ৳38/day over 15 years.',
  },
  {
    id: 'carved-dining',
    title: 'Carved Wooden Dining Set',
    category: 'dining',
    categoryLabel: 'Dining Room',
    price: '৳180,000',
    bgColor: '#7e0f19',
    hook: 'Artisanal floral woodwork brought to life in solid Chittagong teak.',
    description: 'Classic heritage table surrounded by 6 intricately detailed chairs. Polished in a warm lustrous finish that deepens in character over time.',
    image: images.diningTable,
    specs: [
      'Hand-carved relief patterns by master woodcraftsmen',
      'Solid timber joinery crafted for generations of everyday family use',
      'Includes 6 ornate high-backed dining chairs'
    ],
    dimensions: '72"W × 38"D × 30"H (6-Seater 6ft)',
    dailyMath: '≈ ৳33/day over 15 years.',
  },
  {
    id: 'cream-dining',
    title: 'Cream Marble Dining Table Set',
    category: 'dining',
    categoryLabel: 'Dining Room',
    price: '৳165,000',
    bgColor: '#760813',
    hook: 'Warm beige Italian stone matched with champagne velvet seating.',
    description: 'Sleek cream marble top on a sturdy timber pedestal base. Paired with 6 cushioned velvet chairs for refined dining comfort.',
    image: images.creamDining,
    specs: [
      'Hydrophobic sealant prevents liquid absorption and ring marks',
      'Highback champagne velvet chairs provide lumbar support during long meals',
      'Sturdy center pedestal base optimizes legroom for all seated guests'
    ],
    dimensions: '72"W × 38"D × 30"H (6-Seater 6ft)',
    dailyMath: '≈ ৳30/day over 15 years.',
  },
  {
    id: 'gold-chair',
    title: 'Royal Gold Carved Chair',
    category: 'dining',
    categoryLabel: 'Dining Room',
    price: '৳28,000',
    bgColor: '#7a0714',
    hook: 'A single handcrafted accent chair to enrich any room corner.',
    description: 'Solid mahogany frame with gilded detail carving. Perfect as a standalone vanity seat, desk accent, or dining headpiece.',
    image: images.goldChair,
    specs: [
      'Handcrafted mahogany frame with lustrous metallic detailing',
      'Choice of custom upholstery fabrics to coordinate with your home',
      'Compact armless profile fits easily into bedrooms or dining rooms'
    ],
    dimensions: '22"W × 24"D × 40"H',
    dailyMath: '≈ ৳5/day over 15 years.',
  },

  // Office & Chairs
  {
    id: 'executive-chair-brown',
    title: 'Executive Brown Tufted Leather Chair',
    category: 'office',
    categoryLabel: 'Office & Chairs',
    price: '৳48,000',
    bgColor: '#6b0c11',
    hook: 'Chesterfield craftsmanship designed for executive home offices.',
    description: 'Hand-finished cognac leather with button tufting mounted on a solid wooden swivel base. Combines vintage elegance with modern ergonomics.',
    image: images.executiveChair,
    specs: [
      'Supple full-grain upholstery that develops a rich vintage patina',
      'Smooth pneumatic height adjustment with multi-position tilt lock',
      'Solid hardwood 5-star swivel base with dual-wheel casters'
    ],
    dimensions: '28"W × 28"D × 46-50"H',
    dailyMath: '≈ ৳24/workday over 10 years.',
  },
  {
    id: 'executive-chair-black',
    title: 'Executive Black Leather Tufted Chair',
    category: 'office',
    categoryLabel: 'Office & Chairs',
    price: '৳52,000',
    bgColor: '#801218',
    hook: 'Highback director seat with mahogany armrests for video call presence.',
    description: 'Supple black leather with deep cushioned contouring and real wood accents. Provides full upper back and neck support throughout long work sessions.',
    image: images.blackLeatherChair,
    specs: [
      'Refined obsidian upholstery paired with polished hardwood armrests',
      'High-density molded foam padding prevents seat flattening',
      'Heavy-duty tilt mechanism engineered for 12+ hour daily use'
    ],
    dimensions: '29"W × 28"D × 48-52"H',
    dailyMath: '≈ ৳26/workday over 10 years.',
  },
  {
    id: 'mesh-chair',
    title: 'Ergonomic Highback Mesh Chair',
    category: 'office',
    categoryLabel: 'Office & Chairs',
    price: '৳32,000',
    bgColor: '#7a0d1a',
    hook: 'Engineered spinal support to eliminate fatigue during long WFH hours.',
    description: 'Breathable mesh backrest equipped with dynamic lumbar support and 4D adjustable armrests. Keeps you cool and posture-aligned all day.',
    image: images.meshChair,
    specs: [
      'Dynamic lumbar cradle adjusts to your lower back\'s natural curve',
      'High-tension breathable weave prevents heat build-up',
      '4D multi-directional armrests and silent smooth-rolling casters'
    ],
    dimensions: '26"W × 26"D × 44-48"H',
    dailyMath: '≈ ৳16/workday over 10 years.',
  },
  {
    id: 'black-padded-chair',
    title: 'Executive Black Padded Wood Chair',
    category: 'office',
    categoryLabel: 'Office & Chairs',
    price: '৳38,000',
    bgColor: '#76070f',
    hook: 'Sleek dark walnut bentwood design for compact modern workspaces.',
    description: 'Curved walnut veneer shell with padded faux leather seat and back cushion. Delivers executive comfort in a space-saving footprint.',
    image: images.blackPaddedChair,
    specs: [
      'Molded walnut bentwood frame with scratch-resistant clear coat',
      'Padded leatherette cushioning for easy wiping and maintenance',
      'Compact swivel footprint fits neatly under standard desks'
    ],
    dimensions: '24"W × 25"D × 38-42"H',
    dailyMath: '≈ ৳19/workday over 10 years.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Furniture' },
  { key: 'living', label: 'Living Room' },
  { key: 'bedroom', label: 'Bedroom' },
  { key: 'dining', label: 'Dining Room' },
  { key: 'office', label: 'Office & Chairs' },
];

export default function ProductCatalog({
  activeFilter = 'all',
  onSelectCategory,
  sectionHeader = 'Handcrafted Luxury Collection',
}) {
  const [selectedCategory, setSelectedCategory] = useState(activeFilter);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [roomPreviewItem, setRoomPreviewItem] = useState(null);
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
    if (!quickViewItem) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewItem]);

  const currentCategory = onSelectCategory ? activeFilter : selectedCategory;

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    if (onSelectCategory) {
      onSelectCategory(key);
    }
  };

  const filteredProducts = CATALOG_PRODUCTS.filter((prod) =>
    currentCategory === 'all' ? true : prod.category === currentCategory
  );

  const getWhatsAppLink = (item) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in the ${item.title} (${item.price}). Is it in stock? My delivery area is ___.`
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
          <span className="micro-label">OUR COLLECTIONS</span>
          <h2 className={styles.headerTitle}>{sectionHeader}</h2>
          <div className="gold-divider" style={{ margin: '16px auto 24px' }} />
          <p className={styles.headerSub}>
            Crafted from solid Chittagong teak, top-grain leathers, and opulent velvets engineered for enduring comfort.
          </p>

          {/* Filter Tabs */}
          <div className={styles.filterBar}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.filterBtn} ${currentCategory === cat.key ? styles.activeFilter : ''}`}
                onClick={() => handleCategoryChange(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Guarantee / Trust bar */}
          <div className={styles.trustBar}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🚚</span>
              <span>Free Delivery & Assembly in Chattogram</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🛡️</span>
              <span>2-Year Solid Teak Warranty</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔄</span>
              <span>7-Day Exchange Guarantee</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>💳</span>
              <span>EMI Available With 0% Interest</span>
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
                    <p className={styles.productDesc}>{item.description}</p>

                    {item.dimensions && (
                      <div className={styles.dimensionsBadge}>
                        <span className={styles.dimLabel}>📐 Dims:</span> {item.dimensions}
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
                        onClick={() => setQuickViewItem(item)}
                        className={styles.quickViewBtn}
                      >
                        Quick View
                      </button>

                      <button
                        onClick={() => setRoomPreviewItem(item)}
                        className={styles.roomPreviewBtn}
                      >
                        <RoomIcon />
                        See In My Room
                      </button>

                      <a
                        href={getWhatsAppLink(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.orderWhatsappBtn}
                      >
                        💬 Order on WhatsApp
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
          <div className={styles.modalBackdrop} onClick={() => setQuickViewItem(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setQuickViewItem(null)}
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
                      💡 <strong>Investment Value:</strong> {quickViewItem.dailyMath}
                    </div>
                  )}

                  <p className={styles.modalDesc}>{quickViewItem.description}</p>

                  {quickViewItem.dimensions && (
                    <div className={styles.modalDimensions}>
                      📐 <strong>Dimensions (W×D×H):</strong> {quickViewItem.dimensions}
                    </div>
                  )}

                  <div className={styles.modalSpecsGroup}>
                    <h4>Key Craftsmanship & Benefits:</h4>
                    <ul>
                      {quickViewItem.specs.map((spec, i) => (
                        <li key={i}>✓ {spec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.replyGuaranteeNote}>
                    ⚡ <em>We reply within 15 minutes, 10am–10pm on WhatsApp.</em>
                  </div>

                  <div className={styles.modalCtaRow}>
                    <button
                      className={styles.modalSecondaryBtn}
                      onClick={() => {
                        setRoomPreviewItem(quickViewItem);
                        setQuickViewItem(null);
                      }}
                    >
                      <RoomIcon />
                      See It In My Room
                    </button>

                    <a
                      href={getWhatsAppLink(quickViewItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalPrimaryBtn}
                    >
                      💬 Reserve / Inquire on WhatsApp →
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
            onClose={() => setRoomPreviewItem(null)}
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
