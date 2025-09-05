import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const { user, users, setUser, setUsers, logout, upgradePlan } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    profilePic: user?.profilePic || "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = () => {
    const updatedUser = { ...user, ...form };

    setUser(updatedUser);

    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );
    setUsers(updatedUsers);

    setEditing(false);
  };

  const handleUpgrade = () => {
    const plans = ["Trial", "Basic", "Pro"];
    const newPlan = prompt("Enter new plan (Trial, Basic, Pro):", user.plan);

    if (newPlan && plans.includes(newPlan) && newPlan !== user.plan) {
      upgradePlan(newPlan);
      alert(`✅ Upgraded to ${newPlan} plan!`);
    } else if (newPlan && !plans.includes(newPlan)) {
      alert("❌ Invalid plan. Please enter Trial, Basic, or Pro.");
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h2>My Profile</h2>
        <button
          className="logout-btn"
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              logout();
              navigate("/login");
            }
          }}
        >
          Logout
        </button>
      </header>

      <div className="profile-info">
        <img
          src={user.profilePic || "/images/defaultProfile.png"}
          alt="Profile"
          className="profile-pic"
        />

        {editing ? (
          <div className="edit-form">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              value={form.profilePic}
              onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
              placeholder="Profile picture images"
            />
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <h4 className={`plan-badge ${user.plan.toLowerCase()}`}>
              {user.plan}
            </h4>
            <p>Member since: {user.memberSince}</p>
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="profile-actions">
        <button className="upgrade-btn" onClick={handleUpgrade}>
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}

export default Profile;
