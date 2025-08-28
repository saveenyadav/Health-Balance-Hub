import React, { useState } from "react";
import "./Workout.css";

const Workout = () => {
  const allWorkouts = [
    { id: 1, title: "Morning Stretch", type: "Stretching", difficulty: "Beginner", duration: "10 min", image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Start your day with light stretches to wake up muscles and improve flexibility.", video: "https://www.youtube.com/embed/v7AYKMP6rOE" },
    { id: 2, title: "Cardio Blast", type: "Cardio", difficulty: "Intermediate", duration: "20 min", image: "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Boost your heart rate with a 20-minute cardio routine to increase endurance.", video: "https://www.youtube.com/embed/ml6cT4AZdqI" },
    { id: 3, title: "Strength Training", type: "Strength", difficulty: "Intermediate", duration: "25 min", image: "https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Build muscles with simple dumbbell exercises suitable for beginners.", video: "https://www.youtube.com/embed/U0bhE67HuDY" },
    { id: 4, title: "Yoga Flow", type: "Yoga", difficulty: "Beginner", duration: "15 min", image: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Gentle yoga flow to improve flexibility, balance, and mindfulness.", video: "https://www.youtube.com/embed/v7AYKMP6rOE" },
    { id: 5, title: "HIIT Session", type: "Cardio", difficulty: "Advanced", duration: "20 min", 
  image: "https://images.pexels.com/photos/1552101/pexels-photo-1552101.jpeg?auto=compress&cs=tinysrgb&w=600", 
  description: "High-Intensity Interval Training to burn calories and improve endurance quickly.", 
  video: "https://www.youtube.com/embed/ml6cT4AZdqI" },

    { id: 6, title: "Full Body Strength", type: "Strength", difficulty: "Advanced", duration: "30 min", image: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Challenging full body strength workout using dumbbells and bodyweight exercises.", video: "https://www.youtube.com/embed/U0bhE67HuDY" },
    { id: 7, title: "Evening Stretch", type: "Stretching", difficulty: "Beginner", duration: "10 min", image: "https://images.pexels.com/photos/4056741/pexels-photo-4056741.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Relax your muscles and unwind with gentle stretches before bed.", video: "https://www.youtube.com/embed/v7AYKMP6rOE" },
    { id: 8, title: "Power Yoga", type: "Yoga", difficulty: "Intermediate", duration: "20 min", image: "https://images.pexels.com/photos/3823037/pexels-photo-3823037.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Dynamic yoga session to build strength, flexibility, and focus.", video: "https://www.youtube.com/embed/v7AYKMP6rOE" },
    { id: 9, title: "Core Blast", type: "Strength", difficulty: "Intermediate", duration: "15 min", image: "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Quick core workout to strengthen abs and improve posture.", video: "https://www.youtube.com/embed/U0bhE67HuDY" }
  ];

  const [workouts, setWorkouts] = useState(allWorkouts);
  const [modalWorkout, setModalWorkout] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleFilter = (type) => {
    if (type === "All") setWorkouts(allWorkouts);
    else setWorkouts(allWorkouts.filter(w => w.type === type));
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <main className={`workout-container ${darkMode ? "dark" : "light"}`}>
      <header className="workout-header">
        <h1>Workout Plans for All Levels</h1>
        <p>Explore simple workouts filtered by type and difficulty.</p>

        <div className="theme-toggle">
          <button onClick={toggleTheme}>{darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}</button>
        </div>

        <div className="filter-buttons">
          {["All", "Cardio", "Strength", "Yoga", "Stretching"].map(type => (
            <button key={type} onClick={() => handleFilter(type)}>{type}</button>
          ))}
        </div>
      </header>

      <section className="workouts-grid">
        {workouts.map(w => (
          <article key={w.id} className="workout-card" data-type={w.type} onClick={() => setModalWorkout(w)}>
            <img src={w.image} alt={w.title} className="workout-img" />
            <div className="workout-content">
              <h2>{w.title}</h2>
              <p>{w.description.slice(0, 70)}...</p>
              <div className="badges">
                <span className={`badge type ${w.type.toLowerCase()}`}>{w.type}</span>
                <span className={`badge difficulty ${w.difficulty.toLowerCase()}`}>{w.difficulty}</span>
                <span className="badge duration">{w.duration}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {modalWorkout && (
        <div className="modal-overlay" onClick={() => setModalWorkout(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalWorkout(null)}>×</button>
            <h2>{modalWorkout.title}</h2>
            <p><strong>Type:</strong> {modalWorkout.type}</p>
            <p><strong>Difficulty:</strong> {modalWorkout.difficulty}</p>
            <p><strong>Duration:</strong> {modalWorkout.duration}</p>
            <p>{modalWorkout.description}</p>
            {modalWorkout.video && (
              <div className="video-wrapper">
                <iframe
                  src={modalWorkout.video}
                  title={modalWorkout.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Workout;







