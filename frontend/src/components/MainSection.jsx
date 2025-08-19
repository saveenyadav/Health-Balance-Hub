import React from "react";
import styles from "../styles/MainSection.module.css";

function MainSection() {
  return (
    <section className={styles.mainSection}>
      {/* Workout */}
      <div className={styles.section}>
        <img src="/workout.jpg" alt="Workout" className={styles.image} />
        <div className={styles.text}>
          <h2>Workout</h2>
          <p>
            A well-structured workout routine helps you build strength, improve
            endurance, and stay fit. At Health Balance Hub, we focus on
            functional training and exercises tailored to your goals.
          </p>
        </div>
      </div>

      {/* Nutrition */}
      <div className={styles.section}>
        <img src="/nutrition.jpg" alt="Nutrition" className={styles.image} />
        <div className={styles.text}>
          <h2>Nutrition</h2>
          <p>
            Balanced nutrition is the foundation of a healthy lifestyle. We
            guide you with sustainable eating habits that provide energy,
            support muscle growth, and promote long-term wellness.
          </p>
        </div>
      </div>

      {/* Mindset */}
      <div className={styles.section}>
        <img src="/mindset.jpg" alt="Mindset" className={styles.image} />
        <div className={styles.text}>
          <h2>Mindset</h2>
          <p>
            A positive mindset is key to consistency and growth. We help you
            develop discipline, resilience, and motivation to achieve your
            fitness and life goals.
          </p>
        </div>
      </div>

      {/* Wellness Wednesday Challenge */}
      <div className={styles.wellnessChallenge}>
        <h2>Wellness Wednesday Challenge</h2>
        <p>
          Every Wednesday, we bring you a mini challenge to boost your fitness,
          nutrition, or mindset! Complete this week’s task and share your
          progress with us. Let’s make wellness fun and consistent!
        </p>
        <div className={styles.challengeBox}>
          <h3>This Week’s Challenge:</h3>
          <p>15-minute full-body stretch before work. Snap a photo or share your experience!</p>
          <button className={styles.ctaButton}>Join the Challenge</button>
        </div>
      </div>
    </section>
  );
}

export default MainSection;
