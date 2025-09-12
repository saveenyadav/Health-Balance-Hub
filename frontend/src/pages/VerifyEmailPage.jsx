// updated by Okile
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    // Log values for debugging
    console.log("Token:", token, "Email:", email); // updated by Okile

    if (token && email) {
      fetch(`http://localhost:5001/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`) // updated by Okile
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessage("Email verified! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
          } else {
            setMessage(data.message || "Verification failed.");
          }
        })
        .catch(() => setMessage("Verification failed. Please try again."));
    } else {
      setMessage("Invalid verification link.");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>{message}</h2>
    </div>
  );
}