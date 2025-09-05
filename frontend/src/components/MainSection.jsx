import React, { useState } from "react";
import styles from "../styles/MainSection.module.css";

function MainSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.mainSection}>
      {/* Workout */}
      <div className={styles.section}>
        <img src="/images/workout.jpg" alt="Workout" className={styles.image} />
        <div className={styles.text}>
          <h2>Workout</h2>
          <p>
            A well-structured workout routine helps you build strength, improve
            endurance, and stay fit. At Health Balance Hub, we focus on
            functional training and exercises tailored to your goals. Our
            programs include a mix of cardio, strength training, flexibility
            exercises, and recovery techniques, ensuring a holistic approach
            that suits beginners and advanced fitness enthusiasts alike. With
            expert guidance, proper warm-ups, and progressive routines, you'll
            see measurable results while reducing the risk of injuries.
            Additionally, we integrate mobility and core stability exercises to
            enhance overall performance and everyday functional movement.
          </p>
          <a href="/workout" className={styles.readMore}>Read More</a>
        </div>
      </div>

      {/* Nutrition */}
      <div className={styles.section}>
        <img
          src="/images/nutrition.jpg"
          alt="Nutrition"
          className={styles.image}
        />
        <div className={styles.text}>
          <h2>Nutrition</h2>
          <p>
            Balanced nutrition is the foundation of a healthy lifestyle. We
            guide you with sustainable eating habits that provide energy,
            support muscle growth, and promote long-term wellness. From
            customized meal plans and portion control strategies to
            understanding macronutrients and hydration, our approach ensures
            that your body receives everything it needs to perform and recover
            optimally. We also emphasize mindful eating, nutrient timing, and
            incorporating seasonal whole foods to improve digestion, immunity,
            and long-term metabolic health.
          </p>
          <a href="/nutrition" className={styles.readMore}>Read More</a>
        </div>
      </div>

      {/* Mindset */}
      <div className={styles.section}>
        <img
          src="/images/mindset.jpg"
          alt="Mindset"
          className={styles.image}
        />
        <div className={styles.text}>
          <h2>Mindset</h2>
          <p>
            A positive mindset is key to consistency and growth. We help you
            develop discipline, resilience, and motivation to achieve your
            fitness and life goals. Through practical exercises, daily
            reflections, and goal-setting strategies, we empower you to overcome
            mental barriers, stay focused during challenges, and build
            long-lasting habits that support both mental and physical
            well-being. Our programs also teach stress management, visualization
            techniques, and self-motivation strategies so you can maintain a
            balanced outlook, stay committed to your objectives, and enjoy the
            journey of personal growth every day.
          </p>
          <a href="/mindset" className={styles.readMore}>Read More</a>
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
          <p>
            15-minute full-body stretch before work. Snap a photo or share your
            experience!
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => setShowModal(true)}
          >
            Join the Challenge
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>🎉 Thanks for Joining!</h2>
            <p>This week’s challenge:</p>
            <p className={styles.challengeText}>
              ✅ 15-minute full-body stretch before work
            </p>
            <p>
              Share your progress with us on Instagram{" "}
              <strong>@HealthHub</strong> 💪
            </p>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default MainSection;
