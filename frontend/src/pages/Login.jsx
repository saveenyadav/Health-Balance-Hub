import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  
  
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(form);
    if (success) {
      alert("✅ Logged in successfully!");
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-form">
          <h2>Log in</h2>
          <p className="login-link">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" className="primary-btn">Log in</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
