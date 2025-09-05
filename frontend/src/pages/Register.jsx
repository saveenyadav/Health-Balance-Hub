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