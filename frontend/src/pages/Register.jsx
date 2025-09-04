//! GUYS I HAVE UPDATED THIS REGISTER PAGE TO CONNECT TO THE BACKEND. 
//! YOU CAN SEE THE ENTIRE OLD CODE BELOW  - okile

//* enhanced register page with backend api integration - updated by okile

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "./Register.css";

function Register() {
  //* backend auth context - updated by okile
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  //* backend connection: handle register form submission - updated by okile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //* validate form inputs before api call
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("please fill in all fields");
      return;
    }

    //* combine first and last name for backend api
    const name = `${form.firstName} ${form.lastName}`.trim();

    try {
      //* api call to backend register endpoint via authcontext
      const result = await register({
        name,
        email: form.email,
        password: form.password
      });
      
      if (result.success) {
        setError("");
        console.log('registration successful:', name);
        //========00000000000000
        //* redirect to profile page after successful registration
      // navigate("/profile"); //* this should redirect to profile page after successful registration
      
        navigate("/"); //* temporary redirect to home until profile page is created
      } else {
        setError(result.error || "registration failed. please try again.");
      }
    } catch (error) {
      console.error('registration error:', error);
      setError("registration failed. please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-form">
          <h2>create an account</h2>
          <p className="register-link">
            already have an account? <Link to="/login">log in</Link>
          </p>

          {/* display error messages from backend or local validation */}
          {(error || authError) && (
            <p className="error-message">
              {error || authError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="first name"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                disabled={loading} //* disable input during api call
              />
              <input
                type="text"
                placeholder="last name"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                disabled={loading} //* disable input during api call
              />
            </div>
            <input
              type="email"
              placeholder="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading} //* disable input during api call
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading} //* disable input during api call
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <label className="terms">
              <input type="checkbox" required disabled={loading} /> 
              i agree to the <Link to="/terms">terms & conditions</Link>
            </label>
            <button 
              type="submit" 
              className="primary-btn"
              disabled={loading} //* disable button during api call
            >
              {loading ? "creating account..." : "create account"} {/* show loading state */}
            </button>
          </form>

          <div className="divider">or register with</div>
          <div className="social-login">
            <button className="google-btn" disabled={loading}>
              <FcGoogle /> google
            </button>
            <button className="apple-btn" disabled={loading}>
              <FaApple /> apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;







/*
//! ========================================
//! OLD CODE BELOW - BEFORE BACKEND INTEGRATION
//! for team reference and comparison - okile
//! ========================================

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "./Register.css";

function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = register(form);
    if (success) {
      alert("✅ Registration successful! Please log in.");
      navigate("/login");
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-form">
          <h2>Create an account</h2>
          <p className="register-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="First name"
                required
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last name"
                required
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <label className="terms">
              <input type="checkbox" required /> I agree to the{" "}
              <Link to="/terms">Terms & Conditions</Link>
            </label>
            <button type="submit" className="primary-btn">Create account</button>
          </form>

          <div className="divider">Or register with</div>
          <div className="social-login">
            <button className="google-btn"><FcGoogle /> Google</button>
            <button className="apple-btn"><FaApple /> Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;


*/