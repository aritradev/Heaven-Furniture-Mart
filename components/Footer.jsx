'use client';

import { useTranslations } from 'next-intl';
import Logo from './Logo';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const tShowroom = useTranslations('showroom');

  return (
    <footer className={styles.footer} id="footer">
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <Logo
              height={56}
              textColor="#FFFFFF"
              subtextColor="rgba(255, 255, 255, 0.85)"
              accentColor="#EAA023"
            />
          </div>
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>

        {/* Navigation */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('quickLinks')}</h4>
          <a href="#catalog" className={styles.footerLink}>{t('collections')}</a>
          <a href="#bespoke-process" className={styles.footerLink}>{t('bespoke')}</a>
          <a href="#about" className={styles.footerLink}>{t('about')}</a>
          <a href="#visit" className={styles.footerLink}>{t('contact')}</a>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('contact')}</h4>
          <a href="tel:+8801960481983" className={styles.footerLink}>+880 1960-481983</a>
          <a href="mailto:heavenfurnituremart@gmail.com" className={styles.footerLink}>
            heavenfurnituremart@gmail.com
          </a>
          <a
            href="https://maps.google.com/?q=22.3296222,91.7930853"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            {tShowroom('contact.address')}
          </a>
        </div>

        {/* Social */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('followUs')}</h4>
          <a
            href="https://facebook.com/HeavenFurnitureMart"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/heaven_furniture_ltd"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Instagram
          </a>
          <a
            href="https://youtube.com/@HeavenFurnitureMart"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            YouTube
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copyright}>
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
