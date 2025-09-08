import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleMembershipAction = () => {
    navigate("/membership"); // redirect to membership page
  };

  const hasActivePlan = user.plan && user.plan.planName && user.plan.planName !== "No active plan";

  return (
    <main className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="header-title">
          <h1>Profile</h1>
        </div>
        <div className="header-user">
          <h2>Welcome, {user.name}</h2>
        </div>
      </header>

      {/* Info Section with two cards side by side */}
      <section className="info-section">
        {/* User Info Card */}
        <div className="info-card">
          <h3>User Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {user.memberSince}</p>
        </div>

        {/* Membership Card */}
        <div className="info-card">
          <h3>Membership</h3>
          {hasActivePlan ? (
            <>
              <p><strong>Plan:</strong> {user.plan.planName}</p>
              <p><strong>Monthly Fee:</strong> €{user.plan.monthlyFee}</p>
              <p><strong>Total Price:</strong> €{user.plan.totalPrice}</p>
              <p><strong>Payment Method:</strong> {user.plan.paymentMethod}</p>
            </>
          ) : (
            <p><strong>Plan:</strong> No active plan</p>
          )}
        </div>
      </section>

      {/* Membership Action Button */}
      <div className="profile-actions">
        <button className="upgrade-btn" onClick={handleMembershipAction}>
          {hasActivePlan ? "Upgrade Membership 🚀" : "Become a Member 💎"}
        </button>
      </div>
    </main>
  );
}

export default Profile;
