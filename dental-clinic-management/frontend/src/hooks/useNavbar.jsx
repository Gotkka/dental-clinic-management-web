import { useState, useEffect } from "react";

const useNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
      const userObj = JSON.parse(storedUser);
      if (userObj.fullName) setFullName(userObj.fullName);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setFullName('');
  };

  return { isAuthenticated, fullName, logout };
};

export default useNavbar;
