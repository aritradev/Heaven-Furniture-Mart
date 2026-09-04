'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'catalog', label: 'Shop', href: '#catalog' },
  { id: 'bespoke-process', label: 'Bespoke', href: '#bespoke-process' },
  { id: 'testimonials', label: 'Reviews', href: '#testimonials' },
  { id: 'visit', label: 'Visit Us', href: '#visit' },
];

const BOTTOM_NAV_ITEMS = [
  {
    id: 'about',
    label: 'About',
    href: '#about',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-6 8v-4h6v4" />
      </svg>
    ),
  },
  {
    id: 'catalog',
    label: 'Shop',
    href: '#catalog',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: 'bespoke-process',
    label: 'Bespoke',
    href: '#bespoke-process',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'testimonials',
    label: 'Reviews',
    href: '#testimonials',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8M8 14h5" />
      </svg>
    ),
  },
  {
    id: 'visit',
    label: 'Visit Us',
    href: '#visit',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'Inquire',
    href: 'https://wa.me/8801960481983?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20your%20bespoke%20furniture',
    isExternal: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section on scroll for both top and bottom navigation
  useEffect(() => {
    const sectionIds = ['about', 'catalog', 'bespoke-process', 'testimonials', 'visit'];
    const handleSectionObserve = () => {
      // Clear active section highlight when in Hero section (at top of page)
      if (window.scrollY < 300) {
        setActiveSection('');
        return;
      }

      const scrollPosition = window.scrollY + 250;
      let currentActive = '';

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentActive = id;
            break;
          }
        }
      }

      setActiveSection(currentActive);
    };

    handleSectionObserve();
    window.addEventListener('scroll', handleSectionObserve, { passive: true });
    window.addEventListener('resize', handleSectionObserve, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleSectionObserve);
      window.removeEventListener('resize', handleSectionObserve);
    };
  }, []);

  return (
    <>
      {/* Top Header Navigation */}
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="navbar">
        <div className={styles.inner}>
          {/* Centered Logo on Mobile */}
          <a href="#hero" className={styles.logo} aria-label="Heaven Furniture Mart">
            <Logo
              height={scrolled ? 42 : 48}
              textColor={scrolled ? '#2C1810' : '#FFFFFF'}
              subtextColor={scrolled ? '#5C4A3A' : 'rgba(255, 255, 255, 0.9)'}
              accentColor="#EAA023"
            />
          </a>

          {/* Desktop Links with Active Highlight */}
          <ul className={styles.links}>
            {NAV_LINKS.map(({ id, label, href }) => {
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`${styles.link} ${isActive ? styles.activeLink : ''}`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTAs */}
          <div className={styles.ctaGroup}>
            <a
              href="https://wa.me/8801960481983?text=Hi%2C%20I'd%20like%20to%20book%20a%20free%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} btn btn-primary`}
            >
              Free Consultation
            </a>
          </div>
        </div>
      </nav>

      {/* Permanently Fixed Mobile & Medium Device Bottom Navigation Bar */}
      <div className={styles.bottomBar}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const isWhatsApp = item.id === 'whatsapp';

          return (
            <a
              key={item.id}
              href={item.href}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              className={`${styles.bottomNavItem} ${isActive ? styles.activeItem : ''} ${isWhatsApp ? styles.whatsappItem : ''}`}
            >
              <span className={styles.bottomNavIcon}>{item.icon}</span>
              <span className={styles.bottomNavLabel}>{item.label}</span>
            </a>
          );
        })}
      </div>
    </>
  );
}
