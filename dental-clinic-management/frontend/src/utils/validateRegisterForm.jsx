const validateRegisterForm = (formData) => {
    const newErrors = {};
  
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Họ tên không được để trống';
    }
  
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
  
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại phải có đúng 10 chữ số';
    }
  
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }
  
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
  
    if (!formData.gender) {
      newErrors.gender = 'Giới tính không được để trống';
    }
  
    if (!formData.birth_date) {
      newErrors.birth_date = 'Ngày sinh không được để trống';
    }
  
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }
  
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }
  
    return newErrors;
  };
  
  export default validateRegisterForm;
  