import React, { useState } from "react";
import styles from "../styles/Membership.module.css";
import { useNavigate } from "react-router-dom"; // 👈 import useNavigate
import { useAuth } from "../context/AuthContext"; // 👈 import auth

function Membership() {
  const [showPerks, setShowPerks] = useState(false);
  const [loginMessageFor, setLoginMessageFor] = useState(null); // 👈 track which plan shows warning
  const { user } = useAuth(); // 👈 get logged in user
  const navigate = useNavigate(); // 👈 initialize navigate

  // Plans that get the special perks
  const highlightedPlans = ["Premium Plan", "Family Plan", "Corporate Plan"];

  const togglePerks = () => {
    setShowPerks((prev) => !prev);
  };

  // Redirect to checkout page with plan info
  const goToCheckout = (planName, price) => {
    if (user) {
      navigate("/checkout", { state: { planName, price } }); // 👈 pass plan info
    } else {
      setLoginMessageFor(planName); // 👈 show warning only for clicked plan
      setTimeout(() => setLoginMessageFor(null), 3000); // hide after 3s
    }
  };

  return (
    <div className={styles.membershipPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Choose Your Membership</h1>
        <p>
          Flexible plans tailored to your lifestyle. Every level comes packed with value—
          whether you're starting out or aiming to maximize your fitness journey.
        </p>
      </section>

      {/* Plans Section */}
      <section className={styles.plansGrid}>
        {/* Plan 1 */}
        <div className={`${styles.planCard}`}>
          <h2>Basic Plan</h2>
          <p className={styles.price}>€19 / month</p>
          <div className={styles.planFeatures}>
            <p>Unlimited gym access any time you prefer.</p>
            <p>Stay connected with complimentary high-speed Wi-Fi.</p>
            <p>Get started with an introductory fitness consultation session.</p>
            <p>Use secure locker rooms to store your belongings safely.</p>
            <p>Access a wide range of modern cardio training equipment.</p>
            <p>Hydrate easily with access to free water stations daily.</p>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => goToCheckout("Basic Plan", 19)}
          >
            Choose Plan
          </button>
          {loginMessageFor === "Basic Plan" && (
            <p className={styles.loginWarning}>⚠️ Please login first to choose a plan.</p>
          )}
        </div>

        {/* Plan 2 */}
        <div className={`${styles.planCard}`}>
          <h2>Standard Plan</h2>
          <p className={styles.price}>€29 / month</p>
          <div className={styles.planFeatures}>
            <p>Includes all benefits already available in Basic Plan.</p>
            <p>Join energetic group fitness classes throughout the week.</p>
            <p>Receive personalized nutrition guidance from certified experts.</p>
            <p>Enjoy your own personal locker with extra storage space.</p>
            <p>Track your fitness journey with monthly progress reports.</p>
            <p>Get access to weekend workshops on health and wellness.</p>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => goToCheckout("Standard Plan", 29)}
          >
            Choose Plan
          </button>
          {loginMessageFor === "Standard Plan" && (
            <p className={styles.loginWarning}>⚠️ Please login first to choose a plan.</p>
          )}
        </div>

        {/* Plan 3 */}
        <div
          className={`${styles.planCard} ${
            showPerks && highlightedPlans.includes("Premium Plan")
              ? styles.highlightedPlan
              : ""
          }`}
        >
          <h2>Premium Plan</h2>
          <p className={styles.price}>€39 / month</p>
          <div className={styles.planFeatures}>
            <p>Includes every benefit already provided in Standard Plan.</p>
            <p>Work with a certified personal trainer twice per month.</p>
            <p>Attend advanced fitness workshops for deeper knowledge growth.</p>
            <p>Relax and recover with exclusive recovery zone facilities.</p>
            <p>Enjoy priority customer support for faster problem resolution.</p>
            <p>Get free body composition analysis every single month.</p>
            <p>Invite one guest for free training session each month.</p>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => goToCheckout("Premium Plan", 39)}
          >
            Choose Plan
          </button>
          {loginMessageFor === "Premium Plan" && (
            <p className={styles.loginWarning}>⚠️ Please login first to choose a plan.</p>
          )}
        </div>

        {/* Plan 4 */}
        <div
          className={`${styles.planCard} ${
            showPerks && highlightedPlans.includes("Family Plan")
              ? styles.highlightedPlan
              : ""
          }`}
        >
          <h2>Family Plan</h2>
          <p className={styles.price}>€59 / month</p>
          <div className={styles.planFeatures}>
            <p>Membership includes access for up to three family members.</p>
            <p>All family members receive free personalized fitness assessments.</p>
            <p>Participate together in weekend family-friendly fitness classes.</p>
            <p>Add more members at discounted rates to save money.</p>
            <p>Share personal trainer sessions with your entire family group.</p>
            <p>Receive family-based nutrition tips and guidance from experts.</p>
            <p>Kids can enjoy safe child-friendly fitness play areas daily.</p>
            <p>Book classes in advance with priority access features.</p>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => goToCheckout("Family Plan", 59)}
          >
            Choose Plan
          </button>
          {loginMessageFor === "Family Plan" && (
            <p className={styles.loginWarning}>⚠️ Please login first to choose a plan.</p>
          )}
        </div>

        {/* Plan 5 */}
        <div className={`${styles.planCard}`}>
          <h2>Student Plan</h2>
          <p className={styles.price}>€15 / month</p>
          <div className={styles.planFeatures}>
            <p>Get discounted membership pricing exclusively for students only.</p>
            <p>Attend workshops designed to reduce exam-related stress effectively.</p>
            <p>Study together in our group-friendly study lounge areas.</p>
            <p>Join monthly seminars focused on nutrition and wellness education.</p>
            <p>Use our training mobile app with full free access.</p>
            <p>Pause your membership temporarily with flexible freeze options.</p>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => goToCheckout("Student Plan", 15)}
          >
            Choose Plan
          </button>
          {loginMessageFor === "Student Plan" && (
            <p className={styles.loginWarning}>⚠️ Please login first to choose a plan.</p>
          )}
        </div>

        {/* Plan 6 */}
        <div
          className={`${styles.planCard} ${
            showPerks && highlightedPlans.includes("Corporate Plan")
              ? styles.highlightedPlan
              : ""
          }`}
        >
          <h2>Corporate Plan</h2>
          <p className={styles.price}>€99 / month</p>
          <div className={styles.planFeatures}>
            <p>Provide gym access for up to five company employees.</p>
            <p>Host weekly corporate yoga sessions for relaxation and health.</p>
            <p>Boost morale with team-building fitness challenges every month.</p>
            <p>Schedule on-site health checkups for employees at your office.</p>
            <p>Work closely with a dedicated corporate fitness and health coach.</p>
            <p>Access exclusive corporate discounts on additional wellness programs.</p>
            <p>Join quarterly company fitness retreats and networking opportunities.</p>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => goToCheckout("Corporate Plan", 99)}
          >
            Choose Plan
          </button>
          {loginMessageFor === "Corporate Plan" && (
            <p className={styles.loginWarning}>⚠️ Please login first to choose a plan.</p>
          )}
        </div>
      </section>

      {/* Why Join Us */}
      <section className={styles.benefits}>
        <h2>Why Join Us?</h2>
        <div className={styles.benefitGrid}>
          <div className={styles.benefitBox}>💪 Modern Equipment & Functional Zones</div>
          <div className={styles.benefitBox}>🕒 Open 24/7 — Train Your Way</div>
          <div className={styles.benefitBox}>👥 Group Classes for All Levels</div>
          <div className={styles.benefitBox}>🥗 Nutrition & Wellness Coaching</div>
          <div className={styles.benefitBox}>🏋️ Personal Trainers on Demand</div>
          <div className={styles.benefitBox}>📱 Freeze or Manage Membership via App</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.perksSection}>
        <h2>Special Member Perks</h2>
        <p>
          As a valued member, you’ll enjoy more than just a gym. Unlock exclusive
          perks like partner discounts, wellness events, and early access to new
          classes. We believe fitness should extend beyond the gym walls and into
          your lifestyle.
        </p>
        <button className={styles.perksButton} onClick={togglePerks}>
          {showPerks ? "Hide Perks" : "Discover Perks"}
        </button>

        {showPerks && (
          <div className={styles.perksList}>
            <div>🎉 20% discount at partner healthy cafés and restaurants</div>
            <div>🧘 Free access to monthly wellness and meditation workshops</div>
            <div>💼 Priority invites to exclusive fitness events & seminars</div>
            <div>🎁 Member-only giveaways and surprise gifts every quarter</div>
            <div>👟 Discounts on gym merchandise and partner sports brands</div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Membership;
