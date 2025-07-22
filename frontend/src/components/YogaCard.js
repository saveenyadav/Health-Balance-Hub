import axios from 'axios';

const YogaCard = ({ session }) => {
  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/yoga/${session._id}/book`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Booking confirmed!');
    } catch {
      alert('Please log in to book');
    }
  };

  return (
    <div className="yoga-card">
      <h3>{session.title}</h3>
      <p>Trainer: {session.trainer}</p>
      <p>Schedule: {session.schedule}</p>
      <button onClick={handleBooking}>Book</button>
    </div>
  );
};

export default YogaCard;