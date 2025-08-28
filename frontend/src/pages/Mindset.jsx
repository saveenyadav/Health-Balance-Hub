import React from "react";
import styles from "../styles/Mindset.module.css";

const Mindset = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`${styles.container} ${styles.heroContainer}`}>
          {/* LEFT SIDE CONTENT */}
          <div className={styles.heroContent}>
            <h1>Master Your Mindset</h1>
            <p>
              Unlock the potential within you through the power of positive
              thinking, resilience, and self-discipline. Growth starts here.
            </p>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className={styles.heroImage}>
            <img src="/images/mind.jpeg" alt="Mindset" />
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2>Our Services</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>Coaching</h3>
              <p>One-on-one sessions to empower your journey.</p>
            </div>
            <div className={styles.card}>
              <h3>Workshops</h3>
              <p>Interactive workshops to shift your perspective.</p>
            </div>
            <div className={styles.card}>
              <h3>Resources</h3>
              <p>Guides, videos, and tools to strengthen your mindset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className={styles.process}>
        <div className={styles.container}>
          <h2>Our Process</h2>
          <ul className={styles.steps}>
            <li><span>1</span> Awareness</li>
            <li><span>2</span> Action</li>
            <li><span>3</span> Accountability</li>
          </ul>
        </div>
      </section>

      {/* TRAINERS SECTION */}
      <section className={styles.trainers}>
        <div className={styles.container}>
          <h2>Meet Our Trainers</h2>
          <div className={styles.trainerGrid}>
            <div className={styles.trainer}>
              <img src="/images/mind.jpeg" alt="Trainer 1" />
              <h3>Jane Doe</h3>
              <p>Mindset Coach</p>
            </div>
            <div className={styles.trainer}>
              <img src="/images/mind.jpeg" alt="Trainer 2" />
              <h3>John Smith</h3>
              <p>Motivational Speaker</p>
            </div>
            <div className={styles.trainer}>
              <img src="/images/mind.jpeg" alt="Trainer 3" />
              <h3>Sara Lee</h3>
              <p>Wellness Mentor</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section className={styles.schedule}>
        <div className={styles.container}>
          <h2>Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Session</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monday</td>
                <td>Mindfulness Workshop</td>
                <td>10:00 AM</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>Group Coaching</td>
                <td>2:00 PM</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>Motivation Session</td>
                <td>6:00 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* RESOURCES SECTION */}
      <section className={styles.resources}>
        <div className={styles.container}>
          <h2>Resources</h2>
          <p>Explore our collection of tools to support your growth journey.</p>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2>Testimonials</h2>
          <div className={styles.testimonialList}>
            <blockquote>
              "This program changed my life. I feel more confident and focused."
            </blockquote>
            <blockquote>
              "The workshops gave me clarity and motivation like never before."
            </blockquote>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Start Your Journey Today</h2>
          <p>Your new mindset is just one step away.</p>
        </div>
      </section>
    </div>
  );
};

export default Mindset;
