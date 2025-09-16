import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {
  const { login, loading, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Show verification success message if redirected from email verification
  useEffect(() => {
    if (location.state?.verified) {
      setSuccess("Your email has been verified! Please log in.");
    }

    if (location.state?.message) {
      setSuccess(location.state.message);
      if (location.state?.email) {
        setForm(prev => ({ ...prev, email: location.state.email }));
      }
    }

    // Clear message after 5 seconds
    const timer = setTimeout(() => setSuccess(""), 5000);
    return () => clearTimeout(timer);
  }, [location.state]);

  // Clear errors when user starts typing
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");
    setSuccess("");
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoggingIn(true);

    if (!form.email || !form.password) {
      setError("Please provide both email and password");
      setIsLoggingIn(false);
      return;
    }

    try {
      const result = await login(form);

      if (result.success) {
        setSuccess("Login successful. Redirecting...");
        setTimeout(() => {
          navigate("/profile", {
            state: {
              message: result.message || "Welcome back!",
              showWelcome: true
            }
          });
        }, 1500);
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error('login error:', err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const isFormDisabled = loading || isLoggingIn;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-form">
          <h2>Log in</h2>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          {/* Show success messages */}
          {success && (
            <div className="success-message">
              <span>{success}</span>
            </div>
          )}

          {/* Show error messages */}
          {(error || authError) && !success && (
            <div className="error-message">
              <span>{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isFormDisabled}
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isFormDisabled}
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
              disabled={isFormDisabled}
            >
              {isLoggingIn ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
