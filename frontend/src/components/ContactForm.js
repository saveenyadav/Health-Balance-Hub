import React, { useState } from 'react';
import axios from 'axios';

export default function ContactForm() {
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [status, setStatus] = useState(null);
  const handleChange = e => setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/contact', form);
      setStatus('Sent! Thanks for contacting us.');
      setForm({ name:'', email:'', message:'' });
    } catch {
      setStatus('Error sending message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label>Name<input name="name" value={form.name} onChange={handleChange} required/></label>
      <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required/></label>
      <label>Message<textarea name="message" value={form.message} onChange={handleChange} required/></label>
      <button type="submit">Send</button>
      {status && <p aria-live="polite">{status}</p>}
    </form>
  );
}