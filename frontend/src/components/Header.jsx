// Header.jsx
import React from 'react';
import styles from '../styles/Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <video
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.overlay}>
        <div className={styles.logo}>
          <img src="/hbhLogo.png" alt="Health Balance Hub" />
          <h1>Health Balance Hub</h1>
        </div>
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="/blogs">Blogs</a>
          <a href="/yoga">Yoga</a>
          <a href="/contact">Contact</a>
          <a href="/login">Login</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
