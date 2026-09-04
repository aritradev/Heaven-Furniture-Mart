'use client';

import { useState, useEffect } from 'react';
import styles from './ScrollBottomBlur.module.css';

export default function ScrollBottomBlur() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let footerObserver = null;
    let isFooterVisible = false;

    const checkVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollY + clientHeight);

      // Past hero section (>80px) AND not approaching/reaching the footer (<140px)
      const pastHero = scrollY > 80;
      const nearBottom = distanceFromBottom < 140;

      if (!pastHero || nearBottom || isFooterVisible) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    // Use IntersectionObserver on <footer> for ultra-smooth & accurate footer detection
    const footerEl = document.querySelector('footer');
    if (footerEl && typeof IntersectionObserver !== 'undefined') {
      footerObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          isFooterVisible = entry.isIntersecting;
          checkVisibility();
        },
        {
          root: null,
          rootMargin: '0px 0px -20px 0px',
          threshold: 0.02,
        }
      );
      footerObserver.observe(footerEl);
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      if (footerObserver) footerObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`${styles.blurOverlay} ${visible ? styles.visible : ''}`}
      aria-hidden="true"
    />
  );
}

