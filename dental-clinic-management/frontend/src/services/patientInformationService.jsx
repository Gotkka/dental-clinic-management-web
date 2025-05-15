import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/patient-informations';

export const getPatientInformation = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
        throw error;
    }
};

export const createPatientInformation = async (patientData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, patientData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo thông tin bệnh nhân:', error);
        throw error;
    }
};
