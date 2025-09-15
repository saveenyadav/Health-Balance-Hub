import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      fetch(
        `http://localhost:5001/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Redirect immediately to login page with verified state
            navigate("/login", { state: { verified: true, email } });
          } else {
            // Redirect to login with error message if verification failed
            navigate("/login", {
              state: { error: data.message || "Email verification failed." },
            });
          }
        })
        .catch(() => {
          // Redirect to login on network or other errors
          navigate("/login", {
            state: { error: "Email verification failed. Please try again." },
          });
        });
    } else {
      // Redirect to login if the token or email is missing
      navigate("/login", { state: { error: "Invalid verification link." } });
    }
  }, [searchParams, navigate]);

  // The page itself is never rendered; redirect happens immediately
  return <></>;
}
