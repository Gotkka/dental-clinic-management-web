import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const fetchDentists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dentists`);
    return response.data;
  } catch {
    throw new Error('Không thể lấy danh sách bác sĩ');
  }
};

export const fetchSpecializations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/specializations`);
    return response.data;
  } catch {
    throw new Error('Không thể lấy danh sách chuyên khoa');
  }
};
