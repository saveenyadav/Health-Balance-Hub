import React, { useState } from "react";
import axios from "axios";
import "./ContactForm.css"; 
import { FaDumbbell } from "react-icons/fa6";

export default function ContactForm() {
  //* State matches backend Contact model exactly
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  //* Handle form input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  //* Submit form to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      //* FIXED: Call our backend contact API
      const response = await axios.post("http://localhost:5001/api/contact", form);

      //* Handle backend success response
      if (response.data.success) {
        setStatus(" " + response.data.message);
        //* Reset form after successful submission
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (error) {
      //* Handle backend error responses
      const errorMessage = error.response?.data?.error || "Error sending message. Please try again.";
      setStatus(" " + errorMessage);
      setTimeout(() => setStatus(null), 5000);
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Contact Section */}
      <div className="contact-section">
        {/* Header */}
        <div className="contact-header">
          <h1><br />
            Health Balance Hub! <FaDumbbell size={20} color="#322C2C" />
          </h1>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat.
          </p>
        </div>

        {/* Form and Image side-by-side */}
        <div className="contact-container">
          {/* Left side - Contact Form */}
          <div className="contact-card">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              {/* Name field - fixed to matche backend validation */}
              <input
                name="name"
                placeholder="Enter your Name"
                value={form.name}
                onChange={handleChange}
                maxLength={50} //* Backend validation limit
                required
              />
              
              {/* Email field - I used  regex validation in backend*/}
              <input
                type="email"
                name="email"
                placeholder="Enter a valid email address"
                value={form.email}
                onChange={handleChange}
                required
              />
              
              {/* Phone field - optional, matches backend */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
                maxLength={20} //* Backend validation limit
              />
              
              {/* Subject field - fixed to match backend validation */}
              <input
                name="subject"
                placeholder="Enter subject"
                value={form.subject}
                onChange={handleChange}
                maxLength={100} //* Backend validation limit
                required
              />
              
              {/* Message field - also fixed to match backend validation */}
              <textarea
                name="message"
                placeholder="Enter your message"
                value={form.message}
                onChange={handleChange}
                maxLength={1000} //* Backend validation limit
                required
              />
              <small>{form.message.length}/1000 characters</small>
              
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
              
              {status && (
                <p
                  className={
              status.includes("successfully") 
                ? "status-message success" 
                : "status-message error"
            }
                >
                  {status}
                </p>
              )}
            </form>
          </div>

          {/* Right side - Image  */}
          <div className="contact-right">
            <div className="contact-image">
              <img
                src="https://img.freepik.com/free-photo/young-sportive-woman-sitting-fitness-ball-smiling_144627-37951.jpg"
                alt="Fitness"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Section - OUTSIDE */}
      <section className="map-section">
        <h2>Find Us on the Map</h2>
        <p className="map-description">
          Visit our Health Balance Hub fitness center located in the heart of Melbourne, VIC.
        </p>
        <div className="map-container-full">
          <iframe
            title="location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093736!2d144.95373531531695!3d-37.81627927975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f9b1bf%3A0x5045675218ce6e0!2z44CSMzAwMCBBdXN0cmFsaWEsIFZJQywg0JDQstGC0L7RgNGP0YjQuNC5INC-0LHQu9Cw0YHRgtGA0L7QstCw0L3QuNGGgdC4!5e0!3m2!1sen!2sus!4v1616454441234!5m2!1sen!2sus"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Melbourne+VIC"
          target="_blank"
          rel="noopener noreferrer"
          className="map-button"
        >
          Get Directions
        </a>
      </section>
    </>
  );
}