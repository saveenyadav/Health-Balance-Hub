import React from "react";
import styles from "../styles/Mindset.module.css";

export default function Mindset() {
  return (
    <div className={styles.page}>
      
      {/* HERO (full-width background, centered content) */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Master Your Mindset</h1>
          <p>
            Unlock your true potential with the right mindset, habits, and
            guidance.
          </p>
          <button className={styles.cta}>Join Now</button>
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2>Our Services</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>Coaching</h3>
              <p>Personal guidance to transform your thinking patterns.</p>
            </div>
            <div className={styles.card}>
              <h3>Workshops</h3>
              <p>Interactive sessions to practice growth mindset strategies.</p>
            </div>
            <div className={styles.card}>
              <h3>Resources</h3>
              <p>Guides and exercises to build resilience and positivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.process}>
        <div className={styles.container}>
          <h2>Our Process</h2>
          <ul className={styles.steps}>
            <li><span>1</span> Awareness</li>
            <li><span>2</span> Reflection</li>
            <li><span>3</span> Action</li>
            <li><span>4</span> Growth</li>
          </ul>
        </div>
      </section>

      {/* TRAINERS */}
      <section className={styles.trainers}>
        <div className={styles.container}>
          <h2>Meet Our Trainers</h2>
          <div className={styles.trainerGrid}>
            <div className={styles.trainer}>
              <img src="/trainer1.jpg" alt="Trainer 1" />
              <h3>Alex Johnson</h3>
              <p>Mindset Coach</p>
            </div>
            <div className={styles.trainer}>
              <img src="/trainer2.jpg" alt="Trainer 2" />
              <h3>Sophia Lee</h3>
              <p>Wellness Mentor</p>
            </div>
            <div className={styles.trainer}>
              <img src="/trainer3.jpg" alt="Trainer 3" />
              <h3>David Smith</h3>
              <p>Growth Strategist</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className={styles.schedule}>
        <div className={styles.container}>
          <h2>Weekly Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Session</th>
                <th>Trainer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monday</td>
                <td>Mindfulness Basics</td>
                <td>Alex</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>Resilience Training</td>
                <td>Sophia</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>Growth Hacking</td>
                <td>David</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* RESOURCES */}
      <section className={styles.resources}>
        <div className={styles.container}>
          <h2>Free Resources</h2>
          <p>
            Access free e-books, guides, and daily exercises to boost your
            mindset.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2>What People Say</h2>
          <div className={styles.testimonialList}>
            <blockquote>
              “This program completely changed the way I see challenges in life.”
            </blockquote>
            <blockquote>
              “The trainers are amazing and supportive throughout the journey.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* FINAL CTA (full-width background, centered content) */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Ready to Transform Your Mindset?</h2>
          <button className={styles.cta}>Get Started</button>
        </div>
      </section>

    </div>
  );
}
