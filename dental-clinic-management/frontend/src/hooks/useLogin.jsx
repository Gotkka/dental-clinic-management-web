import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useLogin = () => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.username, formData.id, formData.password);
    if (success) {
      alert('Đăng nhập thành công!');
    } else {
      alert(error || 'Đăng nhập thất bại!');
    }
  };

  return { formData, handleChange, handleSubmit, loading, error };
};

export default useLogin;
