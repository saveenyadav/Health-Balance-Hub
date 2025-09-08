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
  const [success, setSuccess] = useState(""); //* success message state
  const [isRegistering, setIsRegistering] = useState(false); //* local loading state

  //* backend connection: handle register form submission - updated by okile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsRegistering(true);

    //* validate form inputs before api call
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("please fill in all fields");
      setIsRegistering(false);
      return;
    }

    //* combine first and last name for backend api
    const name = `${form.firstName} ${form.lastName}`.trim();
    const userEmail = form.email; // Store email before clearing form

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
        console.log('JWT token received:', result.token);
        
        //* show success message
        setSuccess(`Welcome ${name}! Your account has been created successfully.`);
        
        //* clear authentication state so user isn't auto-logged in
        try {
          await fetch('http://localhost:5001/api/auth/logout', { 
            method: 'POST', 
            credentials: 'include' 
          });
          console.log('JWT cookie cleared successfully');
        } catch (logoutError) {
          console.error('Logout error:', logoutError);
        }
        
        //* clear form data
        setForm({ firstName: "", lastName: "", email: "", password: "" });
        
        //* redirect to login page after 2 seconds to show success message
        setTimeout(() => {
          console.log('Starting redirect to login page...');
          console.log('User email for login:', userEmail);
          
          try {
            navigate("/login", { 
              state: { 
                message: `Registration successful! Please log in with your credentials.`,
                email: userEmail,
                fromRegistration: true
              }
            });
            console.log('Navigation to login completed');
          } catch (navigationError) {
            console.error('Navigation error:', navigationError);
            // Fallback navigation without state
            navigate("/login");
          }
        }, 2000);
        
      } else {
        setError(result.error || "registration failed. please try again.");
        console.error('Registration failed:', result.error);
      }
    } catch (error) {
      console.error('registration error:', error);
      setError("registration failed. please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  //* show loading state during registration
  const isFormDisabled = loading || isRegistering;

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-form">
          <h2>create an account</h2>
          <p className="register-link">
            already have an account? <Link to="/login">log in</Link>
          </p>

          {/* display success message */}
          {success && (
            <div className="success-message">
              {success}
              <p className="redirect-info">redirecting to login page...</p>
            </div>
          )}

          {/* display error messages from backend or local validation */}
          {(error || authError) && !success && (
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
                disabled={isFormDisabled} //* disable input during api call
              />
              <input
                type="text"
                placeholder="last name"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                disabled={isFormDisabled} //* disable input during api call
              />
            </div>
            <input
              type="email"
              placeholder="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isFormDisabled} //* disable input during api call
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <label className="terms">
              <input type="checkbox" required disabled={isFormDisabled} /> 
              i agree to the <Link to="/terms">terms & conditions</Link>
            </label>
            <button 
              type="submit" 
              className="primary-btn"
              disabled={isFormDisabled || success} //* disable button during api call or after success
            >
              {isFormDisabled ? "creating account..." : "create account"} {/* show loading state */}
            </button>
          </form>

          <div className="divider">or register with</div>
          <div className="social-login">
            <button className="google-btn" disabled={isFormDisabled}>
              <FcGoogle /> google
            </button>
            <button className="apple-btn" disabled={isFormDisabled}>
              <FaApple /> apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;