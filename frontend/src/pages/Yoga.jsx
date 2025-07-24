import React, { useEffect, useState } from "react";
import axios from "axios";
import YogaCard from "../components/YogaCard";
const trOptions = ["Beginner", "Intermediate", "Advanced"];
const Yoga = () => {
  const [sessions, setSessions] = useState([]);
  const [booking, setBooking] = useState(null);
  const [trainer, setTrainer] = useState(trOptions[0]);
  useEffect(() => {
    axios
      .get("/api/yoga")
      .then((r) => {
        console.log("API Response:", r.data);
        setSessions(Array.isArray(r.data) ? r.data : r.data.sessions || []);
      })
      .catch((err) => {
        console.error("Error fetching sessions:", err);
        setSessions([]);
      });
  }, []);
  const openBooking = (s) => setBooking(s);
  const handleConfirm = () => {
    alert(`Booked "${booking.title}" as ${trainer} session!`);
    setBooking(null);
  };
  return (
    <main className="container">
      <h2>Yoga Sessions</h2>
      <div className="yoga-grid">
        {Array.isArray(sessions) &&
          sessions.map((s) => (
            <YogaCard key={s._id} session={s} onBook={openBooking} />
          ))}
      </div>
      {booking && (
        <div className="modal">
          <div className="modal-content">
            <h3>Book: {booking.title}</h3>
            <label htmlFor="trainer">Select Level:</label>
            <select
              id="trainer"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
            >
              {trOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={() => setBooking(null)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
};
export default Yoga;
