import { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/contact', form);
      alert('Message sent!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      alert('Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;