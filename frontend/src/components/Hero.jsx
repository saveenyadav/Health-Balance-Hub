// src/components/Hero.jsx
import React from "react";
import styles from "../styles/Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <video
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Transform Your Health, Transform Your Life</h1>
          <p>Your journey to balance your body, mind, and soul</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
