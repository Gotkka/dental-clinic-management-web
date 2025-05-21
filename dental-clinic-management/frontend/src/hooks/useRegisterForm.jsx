import { useState } from 'react';
import validateRegisterForm from '../utils/validateRegisterForm';
import { registerUser } from '../services/userService'; 
import { useNavigate } from 'react-router-dom';

const useRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({}); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (onSuccess) => async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await registerUser(formData);
        onSuccess(response.data);
        navigate('/login')
      } catch (error) {
        setErrors({
          api: error.response?.data?.error || 'Đã có lỗi xảy ra khi đăng ký',
        });
      }
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleInputChange,
    handleSubmit,
  };
};

export default useRegisterForm;