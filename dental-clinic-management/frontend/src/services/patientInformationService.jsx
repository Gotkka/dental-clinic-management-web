import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/patient-informations';

export const getPatientInformation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    // console.log('getPatientInformation - Phản hồi:', response.data);
    return response.data;
  } catch (err) {
    console.error('getPatientInformation - Lỗi:', err);
    throw err;
  }
};

export const createPatientInformation = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-or-update`, data);
    console.log('createPatientInformation - Phản hồi:', response.data);
    // Xử lý trường hợp phản hồi lồng nhau (nếu có)
    const result = response.data.data || response.data;
    if (!result.id) {
      throw new Error('Không nhận được ID từ phản hồi.');
    }
    return result;
  } catch (err) {
    console.error('createPatientInformation - Lỗi:', err);
    throw err;
  }
};