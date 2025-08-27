import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Health Balance Hub</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/blogs">Blogs</Link></li>
        <li><Link to="/nutrition">Nutrition</Link></li>
        <li><Link to="/workout">Workout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
