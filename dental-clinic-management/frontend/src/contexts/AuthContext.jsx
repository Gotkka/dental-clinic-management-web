import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, id, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(username, id, password);
      const data = response.data;

      if (response.status === 200) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('id', data.user.id);
        navigate('/');
        return true; 
      } else {
        setError(data.error || 'Đăng nhập thất bại!');
        return false; 
      }
    } catch (err) {
      console.error('Lỗi:', err);
      setError(err.response?.data?.error || 'Lỗi kết nối đến server!');
      return false; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
