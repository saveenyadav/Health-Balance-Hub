import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "./Register.css";

function Register() {
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsRegistering(true);

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all fields");
      setIsRegistering(false);
      return;
    }

    const name = `${form.firstName} ${form.lastName}`.trim();

    try {
      const result = await register({
        name,
        email: form.email,
        password: form.password
      });

      if (result.success) {
        setError("");
        setSuccess(`Welcome ${name}! Your account has been created successfully.`);
        setForm({ firstName: "", lastName: "", email: "", password: "" });

        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: `Registration successful! Please log in with your credentials.`,
              email: form.email 
            }
          });
        }, 2000);

      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const isFormDisabled = loading || isRegistering;

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-form">
          <h2>Create an account</h2>
          <p className="register-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          {success && (
            <div className="success-message">
              {success}
              <p className="redirect-info">Redirecting to login page...</p>
            </div>
          )}
          {(error || authError) && !success && (
            <p className="error-message">{error || authError}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="First name"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                disabled={isFormDisabled}
              />
              <input
                type="text"
                placeholder="Last name"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                disabled={isFormDisabled}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isFormDisabled}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={isFormDisabled}
              />
              <span className="toggle-password" onClick={() => !isFormDisabled && setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <label className="terms">
              <input type="checkbox" required disabled={isFormDisabled} /> I agree to the{" "}
              <Link to="/terms">Terms & Conditions</Link>
            </label>
            <button type="submit" className="primary-btn" disabled={isFormDisabled || success}>
              {isFormDisabled ? "Creating account..." : "Create account"}
            </button>
          </form>
          <div className="divider">Or register with</div>
          <div className="social-login">
            <button className="google-btn" disabled={isFormDisabled}><FcGoogle /> Google</button>
            <button className="apple-btn" disabled={isFormDisabled}><FaApple /> Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;