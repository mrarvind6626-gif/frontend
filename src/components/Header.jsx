import { useState } from 'react';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'Courses', href: '#', hasDropdown: true },
  { label: 'About Us', href: '#', hasDropdown: true },
  { label: 'Help Desk', href: '#' },
  { label: 'Rules', href: '#', hasDropdown: true },
  { label: 'Circulars', href: '#' },
  { label: 'Archives', href: '#', hasDropdown: true },
  { label: 'Institute Login', href: '#', hasDropdown: true },
  { label: 'Candidate Login', href: '#' },
  { label: 'Contact Us', href: '#' },
];

/* ─── SVG logo stand-ins matching screenshot colours ─── */

function AcpcLogo() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-label="ACPC Logo">
      <circle cx="36" cy="36" r="34" fill="#F5A623" />
      <circle cx="36" cy="36" r="28" fill="#fff" />
      <circle cx="36" cy="36" r="24" fill="#1B2D6E" />
      <text x="36" y="33" textAnchor="middle" fill="#F5A623" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">ACPC</text>
      <text x="36" y="44" textAnchor="middle" fill="#fff" fontSize="5.5" fontFamily="Inter,sans-serif">GUJARAT</text>
    </svg>
  );
}

function DteLogo() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-label="DTE Logo">
      <rect x="2" y="2" width="60" height="60" rx="4" fill="#F5A623" />
      <rect x="6" y="6" width="52" height="52" rx="2" fill="#fff" />
      <text x="32" y="38" textAnchor="middle" fill="#1B2D6E" fontSize="20" fontWeight="700" fontFamily="Inter,sans-serif">DTE</text>
    </svg>
  );
}

/* ─── YouTube / Instagram inline icons ─── */

function YtIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-label="YouTube">
      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 22.1 12 22.1 12 22.1s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.4v-2.1C23.3 9.2 23 7 23 7zm-13.5 8.9V8.1l8.1 3.9-8.1 3.9z" />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-label="Instagram">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.3 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.3-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      {/* ── Row 1: Logos + title ── */}
      <div className={styles.topBar}>
        <div className={styles.logoLeft}><AcpcLogo /></div>

        <div className={styles.titleBlock}>
          <p className={styles.titleGujarati}>
            એડ્મિ&shy;ઝન કમિટી ફોર પ્રો&shy;ફ&shy;ઝ&shy;ઓ&shy;નલ કો&shy;ર્સ&shy;ઝ (ACPC), ગ&shy;ઝ&shy;ર&shy;ઝ&shy;ઝ
          </p>
          <p className={styles.titleEnglish}>
            Admission Committee for Professional Courses (ACPC), Gujarat
          </p>
        </div>

        <div className={styles.logoRight}><DteLogo /></div>
      </div>

      {/* ── Row 2: Gold announcement bar ── */}
      <div className={styles.announcementBar}>
        <a href="#" className={styles.announcementLink}>
          CLICK HERE FOR ONLINE ADMISSION REGISTRATION
        </a>
        <div className={styles.socialStrip}>
          <span className={styles.stayUpdated}>Stay Updated</span>
          <a href="#" aria-label="YouTube"><YtIcon /></a>
          <a href="#" aria-label="Instagram"><IgIcon /></a>
        </div>
      </div>

      {/* ── Row 3: Navigation ── */}
      <nav className={styles.navBar} aria-label="Main navigation">
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <ul className={`${styles.navList} ${mobileOpen ? styles.navListOpen : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className={styles.navItem}>
              <a href={item.href} className={styles.navLink}>
                {item.label}
                {item.hasDropdown && <span className={styles.caret}>▾</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
