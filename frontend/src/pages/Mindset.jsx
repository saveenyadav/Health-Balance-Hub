// Mindset.jsx
import React from "react";
import styles from "../styles/Mindset.module.css";

function Mindset() {
  return (
    <main className={styles.mindset}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroContainer}`}> 
          <div className={styles.heroContent}> 
            <h1>Master Your Mindset</h1> 
            <p>
              Unlock the potential within you through the power of positive thinking, resilience, and self-discipline. Growth starts here. 
            </p> 
          </div> 
          <div className={styles.heroImage}> 
            <img src="/images/mind.jpeg" alt="Mindset" /> 
          </div> 
        </div>
      </section>

      {/* Mindset Services Section */}
      <section className={styles.services}>
        <h2>Our Mindset Programs</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.icon}>🧘‍♀️</div>
            <h3>Yoga Classes</h3>
            <p>Enhance flexibility, reduce stress, and connect your body and mind.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🪷</div>
            <h3>Meditation Programs</h3>
            <p>Learn mindfulness, guided visualization, and breathing techniques.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🧠⚙️</div>
            <h3>Mindset Coaching</h3>
            <p>Boost resilience, positivity, and goal-setting skills with expert coaches.</p>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className={styles.howWeWork}>
        <h2>How We Work</h2>
        <div className={styles.timeline}>
          <div className={styles.step}>
            <div className={styles.icon}>🔍</div>
            <p>Assessment</p>
          </div>
          <div className={styles.step}>
            <div className={styles.icon}>📋</div>
            <p>Personal Plan</p>
          </div>
          <div className={styles.step}>
            <div className={styles.icon}>👩‍🏫</div>
            <p>Guided Training</p>
          </div>
          <div className={styles.step}>
            <div className={styles.icon}>📈</div>
            <p>Progress Tracking</p>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className={styles.trainers}>
        <h2>Meet Our Trainers</h2>
        <div className={styles.cardGrid}>
          <div className={styles.trainerCard}>
            <img src="/images/jane.jpeg" alt="Trainer" />
            <h3>Jane Doe</h3>
            <p>Yoga Instructor</p>
            <p>Certified in Hatha and Vinyasa yoga</p>
          </div>
          <div className={styles.trainerCard}>
            <img src="/images/john.jpeg" alt="Trainer" />
            <h3>John Smith</h3>
            <p>Meditation Coach</p>
            <p>Mindfulness and breathing expert</p>
          </div>
          <div className={styles.trainerCard}>
            <img src="/images/sara.jpg" alt="Trainer" />
            <h3>Mary Lee</h3>
            <p>Mindset Coach</p>
            <p>Focus on resilience and positive habits</p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className={styles.resources}>
        <div className={styles.container}>
          <h2>Resources</h2>
          <p>Explore our collection of tools to support your growth journey.</p>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.icon}>📘</div>
              <h3>E-books</h3>
              <p>Download free guides on mindfulness, motivation, and personal growth.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>🎧</div>
              <h3>Podcasts</h3>
              <p>Listen to inspiring talks and interviews with mindset experts.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>🎥</div>
              <h3>Videos</h3>
              <p>Watch tutorials and guided meditation sessions anytime, anywhere.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>📝</div>
              <h3>Worksheets</h3>
              <p>Practice journaling, goal-setting, and reflection with our worksheets.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>📰</div>
              <h3>Articles</h3>
              <p>Read insightful articles on personal growth, motivation, and mindset strategies.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>📄</div>
              <h3>Templates</h3>
              <p>Use ready-to-go templates for goal-setting, planning, and self-assessment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
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
                <td>Yoga Class</td>
                <td>10:00 AM</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>Meditation Coaching</td>
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

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2>Testimonials</h2>
          <div className={styles.testimonialList}>
            <div className={styles.testimonial}>
              <img src="/images/avatar1.jpeg" alt="User 1" className={styles.avatar} />
              <div className={styles.testimonialContent}>
                <h4>Emily R.</h4>
                <p>"This program changed my life. I feel more confident and focused."</p>
              </div>
            </div>
            <div className={styles.testimonial}>
              <img src="/images/avatar2.jpeg" alt="User 2" className={styles.avatar} />
              <div className={styles.testimonialContent}>
                <h4>Michael B.</h4>
                <p>"The workshops gave me clarity and motivation like never before."</p>
              </div>
            </div>
            <div className={styles.testimonial}>
              <img src="/images/avatar3.jpeg" alt="User 3" className={styles.avatar} />
              <div className={styles.testimonialContent}>
                <h4>Sarah K.</h4>
                <p>"I love how personalized the coaching sessions are. Truly transformative!"</p>
              </div>
            </div>
            <div className={styles.testimonial}>
              <img src="/images/avatar4.png" alt="User 4" className={styles.avatar} />
              <div className={styles.testimonialContent}>
                <h4>David L.</h4>
                <p>"I started with little confidence and now I can tackle my goals with a clear mindset."</p>
              </div>
            </div>
            <div className={styles.testimonial}>
              <img src="/images/avatar5.jpeg" alt="User 5" className={styles.avatar} />
              <div className={styles.testimonialContent}>
                <h4>Olivia M.</h4>
                <p>"Highly recommend the mindset programs. Supportive and motivating team!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Start Your Journey Today</h2>
          <p>Your new mindset is just one step away.</p>
        </div>
      </section>
    </main>
  );
}

export default Mindset;
