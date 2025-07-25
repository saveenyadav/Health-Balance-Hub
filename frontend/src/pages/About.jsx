import React from "react";

export default function About() {
  return (
    <main className="container">
      <h2>About Us</h2>
      <p>
        We promote holistic wellbeing via guided fitness, nutrition and yoga
        sessions.
      </p>
      <section className="team">
        <h3>Meet Our Team</h3>
        <p>
          Chinedu Kirian – Certified Trainer
          <br />
          Saveen Yadav – Nutritionist
          <br />
          Okile Moses – Yoga Master
        </p>
      </section>
      <section className="map-social">
        <h3>Contact Info</h3>
        <p>123 Wellness St., Healthy City</p>
        <iframe
          title="Company Map"
          src="https://maps.google.com/maps?q=123+Wellness+St&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
        <h3>Follow Us</h3>
        <p>
          <a href="https://facebook.com" aria-label="Facebook">
            Facebook
          </a>{" "}
          |
          <a href="https://instagram.com" aria-label="Instagram">
            Instagram
          </a>
        </p>
      </section>
    </main>
  );
}