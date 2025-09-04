//! GUYS I HAVE UPDATED THIS LOGIN PAGE TO CONNECT TO THE BACKEND. 
//! YOU CAN SEE THE RNTIRE OLD CODE BELOW  - okile

//* Enhanced login page with backend api integration - updated by okile

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  //* backend auth context - updated by okile
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  //* backend connection: handle login form submission - updated by okile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //* validate form inputs before api call
    if (!form.email || !form.password) {
      setError("please provide both email and password");
      return;
    }

    try {
      //* api call to backend login endpoint via authcontext
      const result = await login(form);
      
      if (result.success) {
        setError("");
        console.log('login successful, redirecting to profile...');

        //========00000000000000
        //navigate("/profile"); //* redirect to profile page after successful login

        navigate("/"); //* temporary redirect to home until profile page is created
      } else {
        setError(result.error || "login failed. please try again.");
      }
    } catch (error) {
      console.error('login error:', error);
      setError("login failed. please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-form">
          <h2>log in</h2>
          <p className="login-link">
            don't have an account? <Link to="/register">register</Link>
          </p>

          {/* display error messages from backend or local validation */}
          {(error || authError) && (
            <p className="error-message">
              {error || authError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading} //* disable input during api call
            />
            <input
              type="password"
              placeholder="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading} //* disable input during api call
            />
            <button 
              type="submit" 
              className="primary-btn"
              disabled={loading} //* disable button during api call
            >
              {loading ? "logging in..." : "log in"} {/* show loading state */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;







/*
//! ========================================
//! OLD CODE BELOW - BEFORE BACKEND INTEGRATION
//! for team reference and comparison - okile
//! ========================================

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(form);
    if (success) {
      setError("");
      navigate("/");
    } else {
      setError("❌ Please create an account to log in.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-form">
          <h2>Log in</h2>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
 <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" className="primary-btn">
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;


*/