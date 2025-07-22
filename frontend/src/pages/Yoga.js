import { useEffect, useState } from 'react';
import axios from 'axios';
import YogaCard from '../components/YogaCard';

const Yoga = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('/api/yoga')
      .then(res => setSessions(res.data))
      .catch(console.error);
  }, []);

  return (
    <section className="yoga-page">
      <h2>Book a Yoga Class</h2>
      {sessions.map(session => (
        <YogaCard key={session._id} session={session} />
      ))}
    </section>
  );
};

export default Yoga;