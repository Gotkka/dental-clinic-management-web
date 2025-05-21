import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useLogin = () => {
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.username, formData.password);

    if (formData.rememberMe) {
      localStorage.setItem('rememberedUsername', formData.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    loading,
    error,
  };
};

export default useLogin;
