'use client';

import Logo from './Logo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
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
          <p className={styles.tagline}>Designed. Crafted. Customized.</p>
        </div>

        {/* Navigation */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <a href="#catalog" className={styles.footerLink}>Collections</a>
          <a href="#bespoke-process" className={styles.footerLink}>Bespoke</a>
          <a href="#about" className={styles.footerLink}>About Us</a>
          <a href="#visit" className={styles.footerLink}>Contact</a>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Contact</h4>
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
            Agrabad Access Road, Chattogram, Bangladesh
          </a>
        </div>

        {/* Social */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Follow Us</h4>
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
            © {new Date().getFullYear()} Heaven Furniture Mart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
