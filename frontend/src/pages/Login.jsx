//! GUYS I HAVE UPDATED THIS LOGIN PAGE TO CONNECT TO THE BACKEND. 
//! YOU CAN SEE THE ENTIRE OLD CODE BELOW  - okile

//* Enhanced login page with backend api integration and registration success handling - updated by okile

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {
  //* backend auth context - updated by okile
  const { login, loading, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  //* redirect if already authenticated - temporary redirect to home until profile page is merged - updated by okile
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  //* check for registration success message from navigation state - updated by okile
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      if (location.state?.email) {
        setForm(prev => ({ ...prev, email: location.state.email }));
      }
      //* clear the message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [location.state]);

  //* clear errors when user starts typing - updated by okile
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError(""); //* clear error when user types
    setSuccess(""); //* clear success message when user types
  };

  //* backend connection: handle login form submission - updated by okile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); //* clear success message when attempting login
    setIsLoggingIn(true);

    //* validate form inputs before api call
    if (!form.email || !form.password) {
      setError("please provide both email and password");
      setIsLoggingIn(false);
      return;
    }

    try {
      //* api call to backend login endpoint via authcontext
      const result = await login(form);
      
      if (result.success) {
        setError("");
        console.log('login successful, redirecting to home...');
        
        //* show success message briefly before redirect - updated by okile
        setSuccess(`Login successful. redirecting to home...`);
        
        //* use the redirect info from AuthContext instead of setTimeout - updated by okile
        if (result.redirect) {
          setTimeout(() => {
            navigate(result.redirect, { 
              state: { 
                message: result.message || "Login successful! Welcome back.",
                showWelcome: true
              }
            });
          }, 1500); //* shorter delay for better UX
        }
        
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('login error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  //* show loading state during login or auth loading
  const isFormDisabled = loading || isLoggingIn;

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-form">
          <h2>Log in </h2>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          {/* show registration success message or login success message - updated by okile */}
          {success && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <span>{success}</span>
            </div>
          )}

          {/* display error messages from backend or local validation */}
          {(error || authError) && !success && (
            <div className="error-message">
              <div className="error-icon">⚠</div>
              <span>{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="email"
              required
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isFormDisabled} //* disable input during api call
            />
            
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isFormDisabled} //* disable input during api call
              />
              <span 
                className="toggle-password" 
                onClick={() => !isFormDisabled && setShowPassword(!showPassword)}
                style={{ cursor: isFormDisabled ? 'not-allowed' : 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button 
              type="submit" 
              className={`primary-btn ${isLoggingIn ? 'loading' : ''}`}
              disabled={isFormDisabled} //* disable button during api call
            >
              {isLoggingIn ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  logging in...
                </span>
              ) : (
                "log in"
              )}
            </button>
          </form>

          {/* forgot password link - can be added later */}
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

//* enhanced login with home redirect and success messages - temporary until profile page merge - updated by okile