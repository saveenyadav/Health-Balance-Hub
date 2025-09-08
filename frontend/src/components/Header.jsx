// Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import styles from "../styles/Header.module.css";
import { FaSearch, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      setDropdownOpen(false);
      navigate("/");
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
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
          <Link to="/membership">Membership</Link>
        </nav>

        {/* Icons */}
        <div className={styles.icons}>
          {/* Search icon */}
          <Link to="/search">
            <FaSearch size={20} />
          </Link>

          {/* User icon with dropdown */}
          <div className={styles.userMenu}>
            <FaUser
              size={20}
              onClick={handleUserClick}
              style={{ cursor: "pointer" }}
            />
            {user && dropdownOpen && (
              <div className={styles.dropdown}>
                <button onClick={handleProfile}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

