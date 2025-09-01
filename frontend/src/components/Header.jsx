// Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; 
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
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/workout">Workout</Link>
          <Link to="/nutrition">Nutrition</Link>
          <Link to="/mindset">Mindset</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Icons */}
        <div className={styles.icons}>
          {/* Search icon -> optional search page */}
          <Link to="/search">
            <FaSearch size={20} />
          </Link>

          {/* User icon -> login page */}
          <Link to="/login">
            <FaUser size={20} />
          </Link>
          
        </div>
      </div>
    </header>
  );
}

export default Header;
