// Header.jsx
import React from 'react';
import styles from '../styles/Header.module.css'; // CSS Module

function Header() {
  return (
    <header className={styles.header}>
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
    </header>
  );
}

export default Header;
