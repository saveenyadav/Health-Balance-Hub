import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // login function
  const login = (userData) => {
    setUser(userData);
    return true;
  };

  // logout function
  const logout = () => {
    setUser(null);
  };

  // register function
  const register = (formData) => {
    // In a real app, this is where you would call your backend API
    console.log("Registering user:", formData);

    // For demo: just pretend registration worked
    return true; // success
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

<!-- 
Has the right structure
No actual API calls to your backend
No JWT token handling
No real authentication -->