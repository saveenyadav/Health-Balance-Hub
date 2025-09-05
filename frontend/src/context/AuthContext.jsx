import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  const [user, setUser] = useState(storedUser);
  const [users, setUsers] = useState(storedUsers);

  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

 
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
    localStorage.removeItem("user"); 
  };

  
  const register = ({ name, email, password, plan = "Trial" }) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      name,
      email,
      password,
      plan,
      profilePic: "https://via.placeholder.com/100", 
      memberSince: new Date().toLocaleDateString(),
    };

    setUsers([...users, newUser]);
    setUser(newUser); 
    return true;
  };

  
  const upgradePlan = (newPlan) => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);

     
      const updatedUsers = users.map((u) =>
        u.email === user.email ? updatedUser : u
      );
      setUsers(updatedUsers);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);