import React, { useState } from "react";
import "./About.css";

const teamMembers = [
  {
    name: "Chinedu Kirian",
    role: "Founder & Wellness Coach",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Chinedu is a certified fitness trainer with over 7 years of experience helping people achieve their fitness goals through personalized training and motivation.",
    skills: ["Strength Training", "Motivation", "Personal Coaching"],
  },
  {
    name: "Ifeoma Ani",
    role: "Nutrition Specialist",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Ifeoma designs balanced meal plans that promote healthy eating without strict restrictions. She believes food should fuel both body and mind.",
    skills: ["Meal Planning", "Dietary Coaching", "Holistic Nutrition"],
  },
  {
    name: "Okile Moses",
    role: "Fitness Trainer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Okile focuses on functional fitness and high-energy workouts that build strength, stamina, and confidence.",
    skills: ["HIIT", "Strength Training", "Endurance"],
  },
  {
    name: "Saveen Yadav",
    role: "Yoga Instructor",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Saveen helps members achieve inner peace and flexibility through mindful yoga practices that nurture both body and spirit.",
    skills: ["Yoga", "Mindfulness", "Flexibility Training"],
  },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCard = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="aboutPage">
      {/* Hero */}
      <header className="aboutHero">
        <h1><br />
          About <span className="highlight">Health Balance Hub</span>
        </h1>
        <p>
          Your trusted space for fitness, nutrition, and mental wellness —
          bringing balance to everyday life.
        </p>
      </header>

      {/* Mission & Vision */}
      <section className="missionVision">
        <div className="mvCard">
          <h3>Our Mission</h3>
          <p>
            Empower individuals to achieve balance in fitness, nutrition, and
            mental wellness with simple, sustainable habits.
          </p>
        </div>
        <div className="mvCard">
          <h3>Our Vision</h3>
          <p>
            A world where everyone has the knowledge and tools to live a
            healthier, happier life.
          </p>
        </div>
      </section>

      {/* Meet Our Team (click to zoom-out) */}
      <section className="teamSection">
        <br /><h2 className="sectionTitle">Meet Our Team</h2><br />
        <div className="teamGrid">
          {teamMembers.map((m, i) => (
            <article
              key={m.name}
              className={`teamCard ${activeIndex === i ? "active" : ""}`}
              onClick={() => toggleCard(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" ? toggleCard(i) : null)}
              aria-expanded={activeIndex === i}
            >
              <img src={m.image} alt={m.name} />
              <h4>{m.name}</h4>
              <p className="role">{m.role}</p>

              {activeIndex === i && (
                <div className="teamDetails">
                  <p className="bio">{m.bio}</p>
                  <ul className="skills">
                    {m.skills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Fitness & Wellness Highlights (8 images, 4 per row on desktop) */}
      <section className="highlights">
        <br /><h2 className="sectionTitle">Fitness & Wellness Highlights</h2><br />
        <div className="highlightsGrid">
          {/* Yoga Practice — replaced with a reliable, working Unsplash image */}
          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=60"
              alt="Yoga Practice"
            />
            <div className="overlay"><p>Yoga Practice</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=60"
              alt="Healthy Eating"
            />
            <div className="overlay"><p>Healthy Eating</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1200&q=60"
              alt="Running Outdoors"
            />
            <div className="overlay"><p>Running Outdoors</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=60"
              alt="Gym Workout"
            />
            <div className="overlay"><p>Gym Workout</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1200&q=60"
              alt="Meditation"
            />
            <div className="overlay"><p>Meditation</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1200&q=60"
              alt="Cycling"
            />
            <div className="overlay"><p>Cycling</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=60"
              alt="Swimming"
            />
            <div className="overlay"><p>Swimming</p></div>
          </div>

          <div className="highlightCard">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60"
              alt="Hiking Adventure"
            />
            <div className="overlay"><p>Hiking Adventure</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
