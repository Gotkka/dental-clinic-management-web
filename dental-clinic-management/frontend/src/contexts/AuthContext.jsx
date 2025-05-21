import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

// Tạo context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check localStorage khi load app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm login chỉ nhận username và password
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(username, password);
      const data = response.data;

      if (response.status === 200) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Điều hướng theo role
        if (data.user.role === 'admin' || data.user.role === 'receptionist' || data.user.role === 'dentist') {
          navigate('/admin');
        } else {
          navigate('/');
        }

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

  // Hàm logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Check role
  const isAdmin = user?.role === 'admin';
  const isPatient = user?.role === 'patient';

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, error, isAdmin, isPatient }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
