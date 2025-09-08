import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //* backend auth state - updated by okile
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //* colleague's localStorage functionality - merged with backend
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const [users, setUsers] = useState(storedUsers);

  //* backend api configuration - updated by okile
  const API_BASE = 'http://localhost:5001/api/auth';

  //* save users to localStorage when users array changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  //* check if user is logged in on app start - updated by okile
  useEffect(() => {
    checkAuthStatus();
  }, []);

  //* backend connection: check authentication status - updated by okile
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/user-profile`, {
        credentials: 'include' //* includes httponly cookies for security
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        console.log('user authenticated:', data.user.name);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //* backend connection: register new user - updated by okile
  const register = async ({ name, email, password, plan = "Trial" }) => {
    try {
      setError(null);
      setLoading(true);

      //* api call to backend register endpoint
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', //* includes cookies for authentication
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success) {
        //* create user object with colleague's profile features
        const newUser = {
          ...data.user,
          plan,
          profilePic: "https://via.placeholder.com/100",
          memberSince: new Date().toLocaleDateString(),
        };

        setUser(newUser);
        console.log('registration successful:', newUser.name);
        return { success: true, message: data.message, token: data.token };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('registration error:', error);
      setError('registration failed. please try again.');
      return { success: false, error: 'registration failed. please try again.' };
    } finally {
      setLoading(false);
    }
  };

  //* backend connection: login user - updated by okile
  const login = async ({ email, password }) => {
    try {
      setError(null);
      setLoading(true);

      //* api call to backend login endpoint
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', //* includes cookies for authentication
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        console.log('login successful:', data.user.name);
        return { 
          success: true, 
          message: data.message,
          token: data.token //* return token for debugging
        };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('login error:', error);
      setError('login failed. please try again.');
      return { success: false, error: 'login failed. please try again.' };
    } finally {
      setLoading(false);
    }
  };

  //* backend connection: logout user - updated by okile
  const logout = async () => {
    try {
      //* api call to backend logout endpoint
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include' //* clears httponly cookies
      });

      setUser(null);
      localStorage.removeItem("user"); //* colleague's localStorage cleanup
      console.log('user logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('logout error:', error);
      //* still clear user locally even if api call fails
      setUser(null);
      localStorage.removeItem("user");
      return { success: true };
    }
  };

  //* backend connection: update user profile - updated by okile
  const updateProfile = async (profileData) => {
    try {
      setError(null);

      //* api call to backend updateprofile endpoint
      const response = await fetch(`${API_BASE}/updateprofile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', //* includes authentication cookies
        body: JSON.stringify({ profile: profileData })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        console.log('profile updated:', data.user.name);
        return { success: true, message: data.message };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('profile update error:', error);
      setError('profile update failed. please try again.');
      return { success: false, error: 'profile update failed. please try again.' };
    }
  };

  //* colleague's upgrade plan functionality - preserved
  const upgradePlan = (newPlan) => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);

      //* update users array if it exists
      const updatedUsers = users.map((u) =>
        u.email === user.email ? updatedUser : u
      );
      setUsers(updatedUsers);
    }
  };

  //* context value with all auth functions and state - merged version
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    upgradePlan, //* colleague's feature preserved
    isAuthenticated: !!user, //* boolean check for authentication status
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

//* enhanced authcontext with real backend api integration - updated by okile
//* merged with colleague's plan upgrade functionality - team collaboration