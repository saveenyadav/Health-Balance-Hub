import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //* backend api configuration - updated by okile
  const API_BASE = 'http://localhost:5001/api/auth';

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
  const register = async ({ name, email, password }) => {
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
        setUser(data.user);
        console.log('registration successful:', data.user.name);
        return { success: true, message: data.message };
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
        return { success: true, message: data.message };
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
      console.log('user logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('logout error:', error);
      //* still clear user locally even if api call fails
      setUser(null);
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

  //* context value with all auth functions and state - updated by okile
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
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