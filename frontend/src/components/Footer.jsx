import React, { useState } from "react";
import styles from "../styles/Footer.module.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setSuccessMessage(
      "💌 Thank you for joining our newsletter! You’ll be updated via email."
    );
    setEmail("");

    // Hide message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <footer className={styles.footer}>
      {/* Top Section */}
      <div className={styles.footerTop}>
        {/* Newsletter Column */}
        <div className={`${styles.column} ${styles.newsletterColumn}`}>
          <h4 className={styles.heading}>Join and be inspired</h4>
          <p className={styles.description}>
            Your daily dose of wellness, mindful living, and holistic health.
          </p>
          <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.newsletterInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.newsletterButton}>
              Confirm
            </button>
          </form>
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
          <small className={styles.policy}>
            By submitting your email you agree to receive updates and wellness
            tips from Health Balance Hub. See our{" "}
            <a href="#">Privacy Policy</a>.
          </small>
        </div>

        {/* Support Column */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Support</h4>
          <ul className={styles.links}>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Track Progress</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Accessibility</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* About Column */}
        <div className={styles.column}>
          <h4 className={styles.heading}>About</h4>
          <ul className={styles.links}>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="#">Feedback</a></li>
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Wellness Ethics</a></li>
          </ul>
        </div>

        {/* Connect Column */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Connect</h4>
          <ul className={styles.socialList}>
            <li><a href="#"><FaFacebookF style={{ color: "#1877F2" }}/> Facebook</a></li>
            <li><a href="#"><FaInstagram className={styles.instagramSvg}/> Instagram</a></li>
            <li><a href="#"><FaYoutube style={{ color: "#FF0000" }} /> YouTube</a></li>
            <li><a href="#"><FaLinkedinIn style={{ color: "#0A66C2" }}/> LinkedIn</a></li>
          </ul>
          <ul className={styles.contact}>
            <li><FaEnvelope style={{ color: "#333333" }}/> info@healthbalancehub.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} Health Balance Hub. All rights reserved.</p>
        <p>Made with ❤️ for a healthier world.</p>
      </div>
    </footer>
  );
};

export default Footer;
