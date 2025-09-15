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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ start as true
  const [error, setError] = useState(null);

  //* Helper to read cookie
  // eslint-disable-next-line no-unused-vars
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  //* Check if session cookie exists and is valid
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/user-profile`, {
        method: "GET",
        credentials: "include", // ✅ include cookie
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

  //* Auto-check auth status on mount
  useEffect(() => {
    checkAuthStatus(); // ✅ always check on mount, cookie will be sent automatically
  }, []);

  //* Register new user
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
      if (data.success) return { success: true, message: data.message };
      setError(data.message);
      return { success: false, error: data.message };
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
        setIsAuthenticated(true);
        return { success: true, message: data.message, user: data.user };
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

  //* Upgrade membership plan and ensure user is authenticated
  const upgradePlan = (planData) => {
    setUser(prev => {
      const updatedUser = prev
        ? {
            ...prev,
            profile: { ...prev.profile, membershipPlan: planData.planName },
            membership: {
              monthlyFee: planData.monthlyFee,
              totalPrice: planData.totalPrice,
              paymentMethod: planData.paymentMethod,
            },
          }
        : {
            email: planData.email || "",
            profile: { membershipPlan: planData.planName },
            membership: {
              monthlyFee: planData.monthlyFee,
              totalPrice: planData.totalPrice,
              paymentMethod: planData.paymentMethod,
            },
          };
      return updatedUser;
    });

    setIsAuthenticated(true);
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
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
