import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const patientService = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients`);
    return response.data;
  } catch {
    throw new Error('Không thể lấy danh sách bệnh nhân');
  }
};

export const createPatientInformation = async (patientInfo) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/create-patient-information`,
      patientInfo
    );
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo thông tin bệnh nhân:', error);
    throw error;
  }
};
