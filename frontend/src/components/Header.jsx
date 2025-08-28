// Header.jsx
import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import { FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Mobile menu icon */}
        <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Logo */}
        <div className={styles.logo}>
          <img src="/images/hbhLogo.png" alt="Health Balance Hub" />
          <span>Health Balance Hub</span>
        </div>

        {/* Navigation */}
        <nav className={`${styles.nav} ${menuOpen ? styles.active : ""}`}>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/blogs">Blogs</a>
          <a href="/workout">Workout</a>
          <a href="/nutrition">Nutrition</a>
          <a href="/mindset">Mindset</a>
          <a href="/contact">Contact</a>
        </nav>

        {/* Icons */}
        <div className={styles.icons}>
          <FaSearch size={20} />
          <FaUser size={20} />
        </div>
      </div>
    </header>
  );
}

export default Header;
