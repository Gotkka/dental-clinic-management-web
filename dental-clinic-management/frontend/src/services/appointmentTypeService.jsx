import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const appointmentTypeService = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointment-types`);
    return response.data;
  } catch {
    throw new Error('Không thể lấy danh sách loại khám');
  }
};
