import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

//* Custom hook for consuming AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const API_BASE_URL = "http://localhost:5001/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // true only after login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  //* Check if session cookie exists and is valid
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/user-profile`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  //* Register new user (email verification required)
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Do NOT set authenticated yet (user must verify + login)
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      return { success: false, error: "Registration failed. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  //* Login existing user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true); // ✅ logged in successfully
        return { success: true, message: data.message, user: data.user, redirect: "/" };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
      return { success: false, error: "Login failed. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  //* Logout user
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setIsAuthenticated(false);
    return { success: true, redirect: "/login" };
  };

  //* Upgrade membership plan (only client-side context update)
  const upgradePlan = (planData) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      profile: { ...prev.profile, membershipPlan: planData.planName },
      membership: {
        monthlyFee: planData.monthlyFee,
        totalPrice: planData.totalPrice,
        paymentMethod: planData.paymentMethod,
      },
    }));
    console.log("User plan upgraded in context:", planData.planName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        checkAuthStatus,
        upgradePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
