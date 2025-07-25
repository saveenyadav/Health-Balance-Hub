import React from "react";

const workouts = [
  { name: "Cardio Blast", details: "30 mins treadmill & HIIT" },
  { name: "Strength Training", details: "Weights & resistance" },
  { name: "Flexibility Flow", details: "Yoga-inspired movements" },
];

export default function Workout() {
  return (
    <main className="container">
      <h2>Workout Routines</h2>
      <div className="cards-grid">
        {workouts.map((w) => (
          <section key={w.name} className="workout-card">
            <h3>{w.name}</h3>
            <p>{w.details}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
