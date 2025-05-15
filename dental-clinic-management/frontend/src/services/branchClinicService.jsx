import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const branchClinicService = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/branchs`);
    return response.data;
  } catch {
    throw new Error('Không thể lấy danh sách chi nhánh');
  }
};
