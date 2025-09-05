import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); 

 
  const login = ({ email, password }) => {
    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (existingUser) {
      setUser(existingUser);
      return true;
    } else {
      return false; 
    }
  };

  
  const logout = () => {
    setUser(null);
  };

  
  const register = ({ email, password }) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return false; 
    }

    const newUser = { email, password };
    setUsers([...users, newUser]);
    console.log("Registered user:", newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);